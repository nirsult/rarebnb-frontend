import { Routes, Route, useLocation } from 'react-router'
import { useEffect } from 'react'

import { StayIndex } from './pages/StayIndex.jsx'
import { AppHeader } from './cmps/AppHeader'
import { UserMsg } from './cmps/UserMsg.jsx'
import { SOCKET_EVENT_ORDER_ADDED, SOCKET_EVENT_ORDER_UPDATED, socketService } from './services/socket.service.js'
import { showSuccessMsg } from './services/event-bus.service.js'
import { StayDetails } from "./pages/StayDetails.jsx"
import { BookingCheckout } from "./pages/BookingCheckout.jsx"
import { Reservations } from "./pages/Reservations.jsx"


export function RootCmp() {
  const location = useLocation()
  const isIndexPage = location.pathname === '/'

  useEffect(() => {
    socketService.on(SOCKET_EVENT_ORDER_ADDED, (order) => {
      showSuccessMsg(`New reservation at ${order.stay.name}!`)
    })
    return () => {
      socketService.off(SOCKET_EVENT_ORDER_ADDED)
    }
  }, [])

  useEffect(() => {
    socketService.on(SOCKET_EVENT_ORDER_UPDATED, (order) => {
      showSuccessMsg(`New order status for ${order.stay.name}!`)
    })
    return () => {
      socketService.off(SOCKET_EVENT_ORDER_UPDATED)
    }
  }, [])

  return (
    <>
      <AppHeader />
      <UserMsg />
      <main className={`main-layout ${isIndexPage ? 'home-padding' : 'default-padding'}`}>
        <Routes>
          <Route path="/" element={<StayIndex />} />
          <Route path="/stay/:stayId" element={<StayDetails />} />
          <Route path="/stay/:stayId/checkout" element={<BookingCheckout />} />
          <Route path="/reservations" element={<Reservations />} />
        </Routes>
      </main>
    </>
  )
}
