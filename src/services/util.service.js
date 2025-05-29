import { stayService } from "./stay"

export function makeId(length = 6) {
  var txt = ''
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (var i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return txt
}

export function getDateTxt(startDate, endDate) {
  if (!startDate || !endDate) return null
  if (startDate.getMonth() === endDate.getMonth()) {
    return `${startDate.toLocaleDateString('default', { month: 'long' })} ${startDate.getDate()}-${endDate.getDate()}`
  } else {
    return `${startDate.toLocaleDateString('default', { month: 'long' })} ${startDate.getDate()}- ${endDate.toLocaleDateString('default', { month: 'long' })} ${endDate.getDate()}`
  }
}

export function makeLorem(size = 100) {
  var words = ['The sky', 'above', 'the port', 'was', 'the color of television', 'tuned', 'to', 'a dead channel', '.', 'All', 'this happened', 'more or less', '.', 'I', 'had', 'the story', 'bit by bit', 'from various people', 'and', 'as generally', 'happens', 'in such cases', 'each time', 'it', 'was', 'a different story', '.', 'It', 'was', 'a pleasure', 'to', 'burn']
  var txt = ''
  while (size > 0) {
    size--
    txt += words[Math.floor(Math.random() * words.length)] + ' '
  }
  return txt
}

export function getRandomIntInclusive(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive 
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}

export function formatRating(rating) {
  return Number.isInteger(rating)
    ? rating.toFixed(1)
    : rating.toFixed(2)
}

export function randomPastTime() {
  const HOUR = 1000 * 60 * 60
  const DAY = 1000 * 60 * 60 * 24
  const WEEK = 1000 * 60 * 60 * 24 * 7

  const pastTime = getRandomIntInclusive(HOUR, WEEK)
  return Date.now() - pastTime
}

export function debounce(func, timeout = 300) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => { func.apply(this, args) }, timeout)
  }
}

export function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function loadFromStorage(key) {
  const data = localStorage.getItem(key)
  return (data) ? JSON.parse(data) : undefined
}

export function getFilterFromSearchParams(searchParams) {
  return {
    country: searchParams.get('country') || '',
    // labels: searchParams.getAll('labels') || [],
    // sortBy: {
    //   type: searchParams.get('sortType') || '',
    //   sortDir: +searchParams.get('sortDir') || 1,
    // },
    pageIdx: +searchParams.get('pageIdx') || 0,
    adults: +searchParams.get('adults') || 0,
    children: +searchParams.get('children') || 0,
    infants: +searchParams.get('infants') || 0,
    pets: +searchParams.get('pets') || 0,
  }
}