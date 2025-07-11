const { DEV, VITE_LOCAL } = import.meta.env

import { orderService as local } from './order.service.local'
import { orderService as remote } from './order.service.remote'

const SERVICE_FEE = 0.18
const CLEANING_FEE = 30
const NIGHT = 1000 * 60 * 60 * 24

function getEmptyOrder(stay) {
  return {
    stayId: stay._id,
    startDate: '',
    endDate: '',
    guestCountMap: { adults: 1, children: 0, infants: 0, pets: 0 },
    pricePerNight: stay.price,
    subTotal: null,
    serviceFee: null,
    cleaningFee: CLEANING_FEE,
    totalPrice: null,
    numOfNights: null,
  }
}

function getPriceBreakdown(stay, nightCount) {
  const perNight = stay.price
  const nightsTotal = stay.price * nightCount
  const serviceFee = stay.price * nightCount * SERVICE_FEE || 30
  const totalPrice = perNight * nightCount + CLEANING_FEE + serviceFee

  return {
    perNight,
    nightsTotal,
    cleaningFee: CLEANING_FEE,
    serviceFee,
    totalPrice
  }
}

function getGuestTotal(guestCountMap) {
  if (typeof guestCountMap !== 'object') return
  return Object.values(guestCountMap).reduce((sum, val) => sum + val, 0)
}

function calculateOrderFees(pricePerNight, numOfNights) {
  const subTotal = pricePerNight * numOfNights
  const serviceFee = subTotal * SERVICE_FEE
  const totalPrice = subTotal + serviceFee + CLEANING_FEE
  return { subTotal, serviceFee, cleaningFee: CLEANING_FEE, totalPrice }
}

function getNightCount(startDate, endDate) {
  if (!startDate || !endDate) return
  return (endDate - startDate) / NIGHT
}

const service = (VITE_LOCAL === 'true') ? local : remote
export const orderService = { getEmptyOrder, calculateOrderFees, getNightCount, getPriceBreakdown, getGuestTotal, ...service }

// Easy access to this service from the dev tools console
// when using script - dev / dev:local

if (DEV) window.orderService = orderService
