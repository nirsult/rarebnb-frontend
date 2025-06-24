import { orderService } from '../../services/order'
import { store } from '../store'
import { ADD_ORDER, REMOVE_ORDER, SET_ORDERS, SET_ORDER, UPDATE_ORDER, ADD_ORDER_MSG, UPDATE_ORDER_TO_SAVE } from '../reducers/order.reducer'
import { SET_ORDER_TO_SAVE } from '../reducers/order.reducer'
import { CLEAR_ORDER_TO_SAVE } from '../reducers/order.reducer'

export async function loadOrders(filterBy) {
  try {
    const orders = await orderService.query(filterBy)
    store.dispatch(getCmdSetOrders(orders))
  } catch (err) {
    console.log('Cannot load orders', err)
    throw err
  }
}

export async function loadOrder(orderId) {
  try {
    const order = await orderService.getById(orderId)
    store.dispatch(getCmdSetOrder(order))
  } catch (err) {
    console.log('Cannot load order', err)
    throw err
  }
}

export async function removeOrder(orderId) {
  try {
    await orderService.remove(orderId)
    store.dispatch(getCmdRemoveOrder(orderId))
  } catch (err) {
    console.log('Cannot remove order', err)
    throw err
  }
}

export async function placeOrder(order) {
  try {
    const savedOrder = await orderService.save(order)
    store.dispatch(getCmdAddOrder(savedOrder))
    return savedOrder
  } catch (err) {
    console.log('Cannot add order', err)
    throw err
  }
}

export async function updateOrder(order) {
  try {
    const savedOrder = await orderService.save(order)
    store.dispatch(getCmdUpdateOrder(savedOrder))
    return savedOrder
  } catch (err) {
    console.log('Cannot save order', err)
    throw err
  }
}

export async function addOrderMsg(orderId, txt) {
  try {
    const msg = await orderService.addOrderMsg(orderId, txt)
    store.dispatch(getCmdAddOrderMsg(msg))
    return msg
  } catch (err) {
    console.log('Cannot add order msg', err)
    throw err
  }
}

export function setEmptyOrderToSave(stay) {
  try {
    const emptyOrder = orderService.getEmptyOrder(stay)
    store.dispatch(getCmdSetEmptyOrderToSave(emptyOrder))
    return emptyOrder
  } catch (err) {
    console.log('Cannot set empty order', err)
    throw err
  }
}

export function updateOrderToSave(updatedOrder) {
  try {
    store.dispatch(getCmdUpdateOrderToSave(updatedOrder))
  } catch (err) {
    console.log('Cannot save order', err)
    throw err
  }
}

// export function updateOrderToSave(field, value) {
//   try {
//     store.dispatch(getCmdUpdateOrderToSave({ field, value }))
//   } catch (err) {
//     console.log('Cannot save order', err)
//     throw err
//   }
// }

export function clearOrderToSave() {
  try {
    store.dispatch(getCmdClearOrderToSave())
  } catch (err) {
    console.log('Cannot clear order', err)
    throw err
  }
}

// Command Creators:
function getCmdSetEmptyOrderToSave(order) {
  return {
    type: SET_ORDER_TO_SAVE,
    order
  }
}
function getCmdUpdateOrderToSave(updatedOrder) {
  return {
    type: UPDATE_ORDER_TO_SAVE,
    updatedOrder
  }
}
// function getCmdUpdateOrderToSave({ field, value }) {
//   return {
//     type: UPDATE_ORDER_TO_SAVE,
//     field,
//     value
//   }
// }
function getCmdClearOrderToSave() {
  return {
    type: CLEAR_ORDER_TO_SAVE,
  }
}
function getCmdSetOrder(order) {
  return {
    type: SET_ORDER,
    order
  }
}
function getCmdSetOrders(orders) {
  return {
    type: SET_ORDERS,
    orders
  }
}
function getCmdRemoveOrder(orderId) {
  return {
    type: REMOVE_ORDER,
    orderId
  }
}
export function getCmdAddOrder(order) {
  return {
    type: ADD_ORDER,
    order
  }
}
export function getCmdUpdateOrder(order) {
  return {
    type: UPDATE_ORDER,
    order
  }
}
function getCmdAddOrderMsg(msg) {
  return {
    type: ADD_ORDER_MSG,
    msg
  }
}

// unitTestActions()
async function unitTestActions() {
  await loadOrders()
  await placeOrder(orderService.getEmptyOrder())
  await updateOrder({
    _id: 'm1oC7',
    name: 'Order-Good',
  })
  await removeOrder('m1oC7')
  // TODO unit test addOrderMsg
}
