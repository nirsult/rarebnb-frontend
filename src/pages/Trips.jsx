import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCmdUpdateOrder, loadOrders, updateOrder } from '../store/actions/order.actions'
import { SOCKET_EVENT_ORDER_UPDATED, socketService } from '../services/socket.service'
import { formatDate, formatPrice, getPluralSuffix } from "../services/util.service"
import { orderService } from "../services/order"
import { showErrorMsg } from "../services/event-bus.service"
import { Loader } from "../cmps/Loader"
import { Link } from "react-router-dom"

export function Trips() {
  const orders = useSelector(storeState => storeState.orderModule.orders)
  const loggedInUser = useSelector((storeState) => storeState.userModule.loggedInUser)
  const filterBy = { guestId: loggedInUser._id, sortField: '_id', sortDir: -1 }
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

    socketService.on(SOCKET_EVENT_ORDER_UPDATED, order => {
      dispatch(getCmdUpdateOrder(order))
    })

    return () => {
      socketService.off(SOCKET_EVENT_ORDER_UPDATED)
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
    <section className="trips">
      <h2>Your trips</h2>

      {!orders.length && <p className="no-trips">No trips to show.</p>}

      {!!orders.length && orders.map((order, idx) => {
        const { stay, status, startDate, endDate, guestCountMap, totalPrice } = order
        const { name, imgUrl, location } = stay
        const guestTotal = orderService.getGuestTotal(guestCountMap)

        return (
          <article key={idx} className="trip-card">
            <img src={imgUrl} alt="" />

            <div className="card-content">
              <header>
                <Link to={`/stay/${stay._id}`}>
                  <h3>{name}</h3>
                </Link>
                <p className="location">{`${location.city}, ${location.country}`}</p>
              </header>
              <p className={`trip-status ${status}`}>{status}</p>

              <ul className="trip-details">
                <li className="dates">
                  {`${formatDate(startDate)} - ${formatDate(endDate)}`}
                </li>
                <li className="guests">{`${guestTotal} guest${getPluralSuffix(guestTotal)}`}</li>
              </ul>

              <p className="price">${formatPrice(totalPrice)}</p>
              {status === 'pending' &&
                <button
                  className="btn-reset btn-cancel"
                  onClick={() => updateStatus(order._id, 'cancelled')} >
                  Cancel reservation
                </button>}
            </div>

          </article>
        )
      })}
    </section >
  )
}