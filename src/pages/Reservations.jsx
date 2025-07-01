import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { getCmdAddOrder, loadOrders, updateOrder } from '../store/actions/order.actions'
import { showErrorMsg } from '../services/event-bus.service'
import { SOCKET_EVENT_ORDER_ADDED, socketService } from '../services/socket.service'
import { formatDate } from "../services/util.service"

export function Reservations() {
  const loggedInUser = useSelector((storeState) => storeState.userModule.loggedInUser)
  const orders = useSelector(storeState => storeState.orderModule.orders)
  const filterBy = { hostId: loggedInUser._id, sortField: '_id', sortDir: -1 }
  const [isLoading, setIsLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    async function fetchOrders() {
      setIsLoading(true)
      try {
        await loadOrders(filterBy)
      } catch (err) {
        console.log('Failed to load orders', err)
      } finally {
        setIsLoading(false)
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

  if (isLoading) return <h2>Loading...</h2>

  return (
    <section className="reservations">
      <h2>Reservations</h2>
      <table>
        <thead>
          <tr>
            <th>Guest</th>
            <th>Status</th>
            <th>Check-in</th>
            <th>Check-out</th>
            <th>Booked</th>
            <th>Listing</th>
            <th>Total Payout</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            return (
              <tr key={order._id}>
                <td className="guest-info">
                  <img src={order.guest.imgUrl} />
                  <span>{order.guest.fullname}</span>
                </td>
                <td>{order.status}</td>
                <td>{formatDate(order.startDate)}</td>
                <td>{formatDate(order.endDate)}</td>
                {/* <td>{order.createdAt}</td> */}
                <td>Booked placeholder</td>
                <td>{order.stay.name}</td>
                <td>${order.totalPrice.toFixed(2)}</td>
                {order.status === 'pending' ? (
                  <td>
                    <button
                      onClick={() => updateStatus(order._id, 'approved')}
                      className="btn-approve"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(order._id, 'rejected')}
                      className="btn-reject"
                    >
                      Reject
                    </button>
                  </td>
                ) : (
                  <td></td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  )
}
