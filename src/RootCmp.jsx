import { Routes, Route, useLocation } from 'react-router'
import { useEffect, useRef } from 'react'

import { StayIndex } from './pages/StayIndex.jsx'
import { AppHeader } from './cmps/AppHeader'
import { UserMsg } from './cmps/UserMsg.jsx'
import { SOCKET_EVENT_ORDER_ADDED, SOCKET_EVENT_ORDER_UPDATED, socketService } from './services/socket.service.js'
import { showSuccessMsg } from './services/event-bus.service.js'
import { useToggle } from "./customHooks/useToggle.js"
import { LoginSignup } from "./cmps/LoginSignup.jsx"


export function RootCmp() {
  const location = useLocation()
  const isIndexPage = location.pathname === '/'

  const [isLoginModalOpen, toggleLoginModal] = useToggle(false)
  const loginModalRef = useRef()

  useEffect(() => {
    function handleClickOutside(ev) {
      if (loginModalRef.current && !loginModalRef.current.contains(ev.target)) {
        toggleLoginModal(false)
      }
    }

    if (isLoginModalOpen) {
      const timeoutId = setTimeout(() => {
        document.addEventListener('click', handleClickOutside)
      }, 0)

      return () => {
        clearTimeout(timeoutId)
        document.removeEventListener('click', handleClickOutside)
      }
    }
  }, [isLoginModalOpen])

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

  useEffect(() => {
    const logFocus = (e) => console.log('FOCUS IN:', e.target)
    window.addEventListener('focusin', logFocus)
    return () => window.removeEventListener('focusin', logFocus)
  }, [])


  return (
    <>
      <AppHeader onLoginClick={() => toggleLoginModal(true)} isLoginModalOpen={isLoginModalOpen} />
      <UserMsg />
      <main className={`main-layout ${isIndexPage ? 'home-padding' : 'default-padding'}`}>
        <Routes>
          <Route path="/" element={<StayIndex />} />
        </Routes>

        {isLoginModalOpen &&
          <LoginSignup
            onClose={() => toggleLoginModal(false)}
            loginModalRef={loginModalRef}
          />}
      </main>
    </>
  )
}
