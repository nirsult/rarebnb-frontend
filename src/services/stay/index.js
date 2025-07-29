const { DEV, VITE_LOCAL } = import.meta.env

import { getRandomIntInclusive, makeId } from '../util.service'

import { stayService as local } from './stay.service.local'
import { stayService as remote } from './stay.service.remote'

function getEmptyStay() {
  return {
    _id: '',
    name: makeId(),
    price: getRandomIntInclusive(80, 240),
    msgs: [],
  }
}

function getDefaultFilter() {
  return {
    // city: '',
    country: '',
    checkIn: '',
    checkOut: '',
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0,
    guestTotal: 0,
  }
}

function getStayAddressStr(stay) {
  if (!stay.loc) return ""
  const { city, country } = stay.loc
  return stay.type
    ? `${stay.type} in ${city}, ${country}`
    : `${city}, ${country} `
}

const service = (VITE_LOCAL === 'true') ? local : remote
export const stayService = { getEmptyStay, getDefaultFilter, getStayAddressStr, ...service }

// Easy access to this service from the dev tools console
// when using script - dev / dev:local

if (DEV) window.stayService = stayService
