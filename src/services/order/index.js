const { DEV, VITE_LOCAL } = import.meta.env

import { getRandomIntInclusive, makeId } from '../util.service'

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
    subTotal: 0,
    serviceFee: 0,
    cleaningFee: CLEANING_FEE,
    totalPrice: 0,
    numOfNights: 0,
  }
}

function calculateOrderFees(pricePerNight, numOfNights) {
  const subTotal = pricePerNight * numOfNights
  const serviceFee = subTotal * SERVICE_FEE
  const totalPrice = subTotal + serviceFee + CLEANING_FEE
  return { subTotal, serviceFee, cleaningFee: CLEANING_FEE, totalPrice }
}

function getNightCount(startDate, endDate) {
  return (endDate - startDate) / NIGHT
}

const service = (VITE_LOCAL === 'true') ? local : remote
export const orderService = { getEmptyOrder, calculateOrderFees, getNightCount, ...service }

// Easy access to this service from the dev tools console
// when using script - dev / dev:local

if (DEV) window.orderService = orderService
