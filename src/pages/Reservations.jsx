import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { orderService } from '../services/order'
import { getCmdAddOrder, loadOrders, updateOrder } from '../store/actions/order.actions'
import { showErrorMsg } from '../services/event-bus.service'
import { SOCKET_EVENT_ORDER_ADDED, SOCKET_EVENT_ORDER_UPDATED, socketService } from '../services/socket.service'

export function Reservations() {
  const loggedInUser = useSelector((storeState) => storeState.userModule.loggedInUser)
  const orders = useSelector(storeState => storeState.orderModule.orders)
  const filterBy = { hostId: loggedInUser._id, sortField: '_id', sortDir: -1 }
  const dispatch = useDispatch()

  useEffect(() => {
    loadOrders(filterBy)

    socketService.on(SOCKET_EVENT_ORDER_ADDED, order => {
      dispatch(getCmdAddOrder(order))
    })

    // socketService.on(SOCKET_EVENT_ORDER_UPDATED, () => {
    //   loadOrders(filterBy)
    // })

    return () => {
      socketService.off(SOCKET_EVENT_ORDER_ADDED)
      // socketService.off(SOCKET_EVENT_ORDER_UPDATED)
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

  function formatDate(dateStr) {
    if (!dateStr) return
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat('en-GB').format(date)
  }

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
