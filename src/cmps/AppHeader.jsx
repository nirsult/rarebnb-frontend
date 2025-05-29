import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { NavLink, useLocation, useSearchParams } from 'react-router-dom'
import { AirbnbLogoFull, AirbnbLogoIcon, MagnifyingGlassIcon, MenuIcon } from './Icons'
import { StayFilterExpanded } from '../cmps/StayFilterExpanded'
import { loadStays } from '../store/actions/stay.actions'
import { StayFilterMinimized } from './StayFilterMinimized'
import { getFilterFromSearchParams } from '../services/util.service'
import { logout } from '../store/actions/user.actions'
import { MainNav } from './MainNav'

export function AppHeader() {
  const loggedInUser = useSelector((storeState) => storeState.userModule.loggedInUser)
  const [isAtTop, setIsAtTop] = useState(true)
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(true)
  const [isScreenWide, setIsScreenWide] = useState(window.innerWidth > 639)
  const [activeSection, setActiveSection] = useState('')


  const [mobileSearchFilter, setMobileSearchFilter] = useState({
    country: '',
    checkIn: '',
    checkOut: '',
    adults: 0,
    children: 0,
    infants: 0,
    pets: 0,
    guestTotal: 0,
  })
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

    const observer = new IntersectionObserver(
      ([entry]) => {
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

  return (
    <>
      <div className="observer-top" ref={topRef}></div>
      <header
        className={`app-header main-layout full ${(isAtTop && currPage.pathname === '/') || isHeaderExpanded ? 'header-large' : 'header-small'
          }`}
      >

        {!isHeaderExpanded && (
          <StayFilterMinimized
            filterBy={filterBy}
            isHidden={isAtTop && currPage.pathname === '/'}
            setIsHeaderExpanded={setIsHeaderExpanded}
            setActiveSection={setActiveSection}
          />
        )}

        {/* Shared content: logo and user menu */}
        <section className="header-content">
          <NavLink to="/" className="logo">
            <AirbnbLogoIcon className="logo-icon" />
            <img className='logo-full' src="https://res.cloudinary.com/dbbj46yzt/image/upload/v1748125476/ChatGPT_Image_May_25_2025_01_24_19_AM_ih42tm.png" />
          </NavLink>
          {((isAtTop && currPage.pathname === '/') || isHeaderExpanded) && <MainNav />}
        </section>

        {/* Desktop: always show expanded filter when at top or open */}
        {isScreenWide && (isHeaderExpanded || isAtTop) && (
          <StayFilterExpanded
            filterBy={filterBy}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />
        )}

        {/* Mobile: show expanded filter inside overlay modal */}
        {!isScreenWide && isHeaderExpanded && (
          <div className="mobile-overlay">
            <button
              className="btn-close-overlay"
              onClick={() => setIsHeaderExpanded(false)}
            >
              ×
            </button>
            <StayFilterExpanded
              filterBy={filterBy}
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              onClose={() => {
                setActiveSection('')
                setIsHeaderExpanded(false)
              }}
            />
          </div>
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
