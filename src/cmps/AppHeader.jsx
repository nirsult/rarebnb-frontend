import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { NavLink, useLocation, useSearchParams } from 'react-router-dom'
import { AirbnbLogoIcon, HamburgerIcon, } from './Icons'
import { StayFilterExpanded } from '../cmps/StayFilterExpanded'
import { loadStays } from '../store/actions/stay.actions'
import { StayFilterMinimized } from './StayFilterMinimized'
import { getFilterFromSearchParams } from '../services/util.service'
import { logout } from '../store/actions/user.actions'
import { MainNav } from './MainNav'
import { useToggle } from "../customHooks/useToggle"
import { HamburgerMenu } from "./HamburgerMenu"
import { Popover } from "./Popover"
import { LoginSignup } from "./LoginSignup"

export function AppHeader() {
  const loggedInUser = useSelector((storeState) => storeState.userModule.loggedInUser)
  const [isAtTop, setIsAtTop] = useState(true)
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(true)
  const [activeSection, setActiveSection] = useState('date')

  const [isMenuOpen, toggleMenu] = useToggle(false)
  const menuRef = useRef()
  const [isLoginModalOpen, toggleLoginModal] = useToggle(false)
  const loginModalRef = useRef()

  const topRef = useRef()
  const currPage = useLocation()

  const [searchParams, setSearchParams] = useSearchParams()
  const filterBy = getFilterFromSearchParams(searchParams)

  useEffect(() => {
    const hasToken = document.cookie.includes('loginToken')
    const hasUser = !!loggedInUser

    if (!hasUser && hasToken) {
      logout()
    }
  }, [loggedInUser])

  useEffect(() => {
    loadStays(filterBy)
  }, [searchParams])

  useEffect(() => {
    const filterBy = Object.fromEntries(searchParams.entries())
    filterBy.pageIdx = +filterBy.pageIdx || 0
  }, [])

  useEffect(() => {
    if (currPage.pathname !== '/') {
      setIsAtTop(false)
      setIsHeaderExpanded(false)
    }

    const observer = new IntersectionObserver(([entry]) => {
      setIsAtTop(entry.isIntersecting)
      if (entry.isIntersecting) {
        setIsHeaderExpanded(false)
      }
    },
      { root: null, threshold: 0 }
    )

    if (topRef.current) {
      observer.observe(topRef.current)
    }

    return () => {
      if (topRef.current) observer.unobserve(topRef.current)
    }
  }, [currPage.pathname])

  useEffect(() => {
    function handleClickOutside(ev) {
      if (menuRef.current && !menuRef.current.contains(ev.target)) {
        toggleMenu(false)
      }
    }

    if (isMenuOpen) {
      const timeoutId = setTimeout(() => {
        document.addEventListener('click', handleClickOutside)
      }, 0)

      return () => {
        clearTimeout(timeoutId)
        document.removeEventListener('click', handleClickOutside)
      }
    }
  }, [isMenuOpen])

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


  return (
    <>
      <div className="observer-top" ref={topRef}></div>
      <header
        className={`app-header main-layout full 
          ${(isAtTop && currPage.pathname === '/')
            || isHeaderExpanded ? 'header-large' : 'header-small'
          }`}
      >

        <section className="header-content">
          <h1>
            <NavLink to="/" className="logo">
              <AirbnbLogoIcon className="logo-icon" />
              <img className='logo-full' src="https://res.cloudinary.com/dbbj46yzt/image/upload/v1748125476/ChatGPT_Image_May_25_2025_01_24_19_AM_ih42tm.png" />
            </NavLink>
          </h1>
          {((isAtTop && currPage.pathname === '/') || isHeaderExpanded) && <MainNav />}

          <div className="menu-wrapper">
            <button
              className="btn-hamburger-menu"
              onClick={toggleMenu}
            >
              <HamburgerIcon />
            </button>
            {isMenuOpen &&
              <Popover style={{ right: 0 }} menuRef={menuRef}>
                <HamburgerMenu
                  onClose={() => toggleMenu(false)}
                  onLoginClick={() => toggleLoginModal(true)}
                />
              </Popover>
            }
          </div>
        </section>

        {isLoginModalOpen &&
          <LoginSignup
            onClose={() => toggleLoginModal(false)}
            loginModalRef={loginModalRef}
          />}


        {!isHeaderExpanded && (
          <StayFilterMinimized
            filterBy={filterBy}
            isHidden={isAtTop && currPage.pathname === '/'}
            setIsHeaderExpanded={setIsHeaderExpanded}
            setActiveSection={setActiveSection}
          />
        )}

        {(isHeaderExpanded || isAtTop) && (
          <StayFilterExpanded
            filterBy={filterBy}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />
        )}

      </header>

      <div
        className={`header-backdrop ${!isAtTop && isHeaderExpanded ? 'visible' : ''
          }`}
        onClick={() => {
          setIsHeaderExpanded(false)
          setActiveSection('')
        }}
      ></div>
    </>
  )
}
