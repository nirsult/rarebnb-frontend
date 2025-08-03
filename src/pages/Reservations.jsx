import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { getCmdAddOrder, loadOrders, updateOrder } from '../store/actions/order.actions'
import { showErrorMsg } from '../services/event-bus.service'
import { SOCKET_EVENT_ORDER_ADDED, socketService } from '../services/socket.service'
import { formatDate, formatPrice, getDefaultOrderFilter, getPluralSuffix } from "../services/util.service"
import { Loader } from "../cmps/Loader"
import { Link } from "react-router-dom"
import { orderService } from "../services/order"

export function Reservations() {
  const loggedInUser = useSelector((storeState) => storeState.userModule.loggedInUser)
  const orders = useSelector(storeState => storeState.orderModule.orders)
  const [filterBy, setFilterBy] = useState({
    hostId: loggedInUser._id,
    ...getDefaultOrderFilter()
  })
  const [isPageLoading, setIsPageLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    async function fetchOrders() {
      setIsPageLoading(true)
      try {
        await loadOrders(filterBy)
      } catch (err) {
        console.log('Failed to load orders', err)
      } finally {
        setIsPageLoading(false)
      }
    }

    fetchOrders()

    socketService.on(SOCKET_EVENT_ORDER_ADDED, order => {
      dispatch(getCmdAddOrder(order))
    })

    return () => {
      socketService.off(SOCKET_EVENT_ORDER_ADDED)
    }
  }, [loggedInUser, filterBy])

  async function updateStatus(orderId, newStatus) {
    const orderToUpdate = orders.find((order) => order._id === orderId)
    if (!orderToUpdate) return

    try {
      const updatedOrder = { ...orderToUpdate, status: newStatus }
      updateOrder(updatedOrder)
    } catch (err) {
      console.log('Failed to update order status', err)
      showErrorMsg('Something went wrong. Please try again.')
    }
  }

  function handleFilterChange(ev) {
    const { name, value } = ev.target
    setFilterBy(prev => ({ ...prev, [name]: value }))
  }

  function handleSortChange(ev) {
    const { value } = ev.target
    const [sortField, sortDir] = value.split(':')
    setFilterBy(prev => ({
      ...prev,
      sortField,
      sortDir: +sortDir
    }))
  }

  function handleCheckboxChange(ev) {
    setFilterBy(prev => ({
      ...prev,
      includePast: ev.target.checked
    }))
  }

  if (isPageLoading) return <Loader className="center" />

  return (
    <section className="reservations">
      <h2>Manage reservations</h2>

      <form>
        <section className="status">
          <label htmlFor="status">Status:</label>
          <select name="status" id="status" value={filterBy.status} onChange={handleFilterChange}>
            <option value="all">All</option>
            <option value="approved">approved</option>
            <option value="rejected">rejected</option>
            <option value="pending">pending</option>
            <option value="cancelled">cancelled</option>
          </select>
        </section>

        <section className="sort">
          <label htmlFor="sort">Sort:</label>
          <select name="sort" id="sort" value={`${filterBy.sortField}: ${filterBy.sortDir}`} onChange={handleSortChange}>
            <option value="startDate: -1">Check-in: Later first</option>
            <option value="startDate: 1">Check-in: Earlier first</option>
            <option value="_id: -1">Date placed: Newest first</option>
            <option value="_id: 1">Date placed: Oldest first</option>
          </select>
        </section>

        <label>
          <input type="checkbox" checked={filterBy.includePast} onChange={handleCheckboxChange} />
          Include past trips
        </label>
      </form>

      {!orders.length && <p className="no-reservations">No reservations to show.</p>}

      {!!orders.length && orders.map((order, idx) => {
        const { stay, status, startDate, endDate, guestCountMap, totalPrice, guest } = order
        const { name, imgUrl, location } = stay
        const guestTotal = orderService.getGuestTotal(guestCountMap)

        return (
          <article key={idx} className="reservation-card">
            <div className="img-container">
              <img src={imgUrl} className="media-cover" />
            </div>

            <div className="reservation-details">

              <header>
                <Link to={`/stay/${stay._id}`}>
                  <h3>{name}</h3>
                </Link>
                <p className="location">{`${location.city}, ${location.country}`}</p>
              </header>
              <p className={`reservation-status ${status}`}>{status}</p>

              <div className="guest-info">
                <img src={guest.imgUrl} alt="" />
                <h4>{guest.fullname}</h4>
                <p>{`for ${guestTotal} guest${getPluralSuffix(guestTotal)}`}</p>
              </div>

              <div className="dates">
                <p>
                  <span className="label">Check-in</span>
                  <span className="value">{formatDate(startDate)}</span>
                </p>
                <p>
                  <span className="label">Check-out</span>
                  <span className="value">{formatDate(endDate)}</span>
                </p>
              </div>
            </div>

            <div className="actions">


              <p className="price"><span className="label"> Total price</span> <span className="value"> ${formatPrice(totalPrice)}</span></p>

              {status === 'pending' &&
                <>
                  <button
                    className="btn-reset btn-action approve"
                    onClick={() => updateStatus(order._id, 'approved')} >
                    Approve
                  </button>
                  <button
                    className="btn-reset btn-action reject"
                    onClick={() => updateStatus(order._id, 'rejected')} >
                    Reject
                  </button>
                </>
              }
            </div>
          </article>
        )
      })}
    </section >
  )
}
