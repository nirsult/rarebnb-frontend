import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { getCmdAddOrder, loadOrders, updateOrder } from '../store/actions/order.actions'
import { showErrorMsg } from '../services/event-bus.service'
import { SOCKET_EVENT_ORDER_ADDED, socketService } from '../services/socket.service'
import { formatDate, formatPrice, getPluralSuffix } from "../services/util.service"
import { Loader } from "../cmps/Loader"
import { Link } from "react-router-dom"

export function Reservations() {
  const loggedInUser = useSelector((storeState) => storeState.userModule.loggedInUser)
  const orders = useSelector(storeState => storeState.orderModule.orders)
  const filterBy = { hostId: loggedInUser._id, sortField: '_id', sortDir: -1 }
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
  }, [loggedInUser])

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

  if (isPageLoading) return <Loader className="center" />

  return (
    <section className="reservations">
      <h2>Manage reservations</h2>

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
