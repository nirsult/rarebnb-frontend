import { useEffect, useRef, useState } from 'react'
import { GuestPicker } from './GuestPicker'
import { Popover } from './Popover'
import { MagnifyingGlassIcon } from './Icons'
import { MyDatePicker } from './MyDatePicker'
import { formatDate } from '../services/util.service'
import { useSearchParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

export function StayFilterExpanded({
  filterBy,
  setFilterBy,
  activeSection,
  setActiveSection,
  onClose,
}) {
  const [filterByToEdit, setFilterByToEdit] = useState(filterBy)
  const isFocused = !!activeSection
  const filterBarRef = useRef()
  const locationInputRef = useRef()
  const [searchParams, setSearchParams] = useSearchParams()
  const isMobile = window.innerWidth < 744
const navigate = useNavigate()


  useEffect(() => {
    function handleClickOutside(ev) {
      if (filterBarRef.current && !filterBarRef.current.contains(ev.target)) {
        ev.preventDefault()
        ev.stopPropagation()
        setActiveSection('')

        if (locationInputRef.current) {
          locationInputRef.current.blur()
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (activeSection === 'location' && locationInputRef.current) {
      locationInputRef.current.focus()
    }
  }, [activeSection])

  function handleChange({ target }) {
    let { value, name: field, type } = target

    value = type === 'number' ? +value || '' : value
    setFilterByToEdit((prevFilter) => ({ ...prevFilter, [field]: value }))
  }

  function handleDateChange({ checkIn, checkOut }) {
    setFilterByToEdit((prev) => ({
      ...prev,
      checkIn,
      checkOut,
    }))
  }

  function onSetGuests(guests) {
    const total = Object.values(guests).reduce((acc, count) => acc + count, 0)
    setFilterByToEdit((prev) => ({ ...prev, ...guests, guestTotal: total }))
  }

  function handleSearch(ev) {
    ev.preventDefault()
    ev.stopPropagation()
    setActiveSection('')

     if (onClose) onClose()
      
    const params = new URLSearchParams()

    for (const key in filterByToEdit) {
      const val = filterByToEdit[key]
      if (val !== '' && val !== 0) {
        params.set(key, val)
      }
    }

    params.set('pageIdx', 0)

    setSearchParams(params)
  }

  const { country, checkIn, checkOut, adults, children, infants, pets } =
    filterByToEdit
  const totalGuests = adults + children + infants + pets

  return (
    <>
      {isMobile ? (
        <section className="mobile-search-modal">
          <button className="btn-close-modal" onClick={onClose}>
            ×
          </button>
          <h2 className="mobile-title">Where to?</h2>

          <div
            className="mobile-filter-item"
            onClick={() => setActiveSection('location')}
          >
            <label>Where</label>
            <input
              value={country}
              onChange={handleChange}
              placeholder="Search destinations"
              ref={locationInputRef}
              name="country"
              className="mobile-input"
            />
          </div>

          <div
            className="mobile-filter-item"
            onClick={() => setActiveSection('check-in')}
          >
            <label>When</label>
            <span>
              {checkIn && checkOut
                ? `${formatDate(checkIn)} – ${formatDate(checkOut)}`
                : 'Add dates'}
            </span>

            {(activeSection === 'check-in' ||
              activeSection === 'check-out') && (
              <div
                className="date-inline-modal"
                onClick={(ev) => ev.stopPropagation()}
              >
                <button
                  className="btn-close-modal"
                  onClick={(ev) => {
                    ev.stopPropagation()
                    setActiveSection('')
                  }}
                >
                  ×
                </button>
                <MyDatePicker
                  onSetDates={handleDateChange}
                  setActiveSection={setActiveSection}
                  markedDates={[checkIn, checkOut]}
                />
              </div>
            )}
          </div>

          <div
            className="mobile-filter-item guests-wrapper"
            onClick={() => setActiveSection('guests')}
          >
            <label>Guests</label>
            <span>
              {totalGuests > 0 ? `${totalGuests} guests` : 'Add guests'}
            </span>

            {activeSection === 'guests' && (
              <div
                className="guests-inline-modal"
                onClick={(ev) => ev.stopPropagation()}
              >
                <button
                  className="btn-close-modal"
                  onClick={(ev) => {
                    ev.stopPropagation()
                    setActiveSection('')
                  }}
                >
                  ×
                </button>
                <GuestPicker
                  onSetGuests={onSetGuests}
                  guests={{ adults, children, infants, pets }}
                />
              </div>
            )}
          </div>

          <button className="mobile-search-btn" onClick={handleSearch}>
            <MagnifyingGlassIcon />
            Search
          </button>
        </section>
      ) : (


        // ! DESKTOP VIEW 
        <section
          ref={filterBarRef}
          className={`filter-bar ${isFocused ? 'focused' : ''}`}
        >
          <button
            className={`btn-filter btn-location ${
              activeSection === 'location' ? 'active' : ''
            }`}
            onClick={() => setActiveSection('location')}
          >
            <div className="btn-content">
              <label htmlFor="country" className="btn-label">
                Where
              </label>
              <input
                value={country}
                onChange={handleChange}
                ref={locationInputRef}
                type="text"
                placeholder="Search destinations"
                id="country"
                name="country"
                onKeyDown={(ev) => {
                  if (ev.key === 'Enter') {
                    ev.target.blur()
                    setActiveSection('check-in')
                  }
                }}
              />
            </div>
          </button>

          <button
            className={`btn-filter btn-check-in ${
              activeSection === 'check-in' ? 'active' : ''
            }`}
            onClick={() => setActiveSection('check-in')}
          >
            <div className="btn-content">
              <span className="btn-label">Check in</span>
              <span className="btn-value">
                {checkIn ? formatDate(checkIn) : 'Add dates'}
              </span>
            </div>
          </button>

          <button
            className={`btn-filter btn-check-out ${
              activeSection === 'check-out' ? 'active' : ''
            }`}
            onClick={() => setActiveSection('check-out')}
          >
            <div className="btn-content">
              <span className="btn-label">Check out</span>
              <span className="btn-value">
                {checkOut ? formatDate(checkOut) : 'Add dates'}
              </span>
            </div>
          </button>

          <button
            className={`btn-filter btn-guests ${
              activeSection === 'guests' ? 'active' : ''
            }`}
            onClick={() => setActiveSection('guests')}
          >
            <div className="btn-content">
              <span className="btn-label">Who</span>
              <span className="btn-value">
                {totalGuests > 0 ? `${totalGuests} guests` : 'Add guests'}
              </span>
            </div>
            <span className="search-icon" onClick={handleSearch}>
              <MagnifyingGlassIcon />
            </span>
          </button>

          {(activeSection === 'check-in' || activeSection === 'check-out') && (
            <Popover
              style={{
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100%',
              }}
            >
              <MyDatePicker
                onSetDates={handleDateChange}
                setActiveSection={setActiveSection}
                markedDates={[checkIn, checkOut]}
              />
            </Popover>
          )}

          {activeSection === 'guests' &&
            (isMobile ? (
              <div className="mobile-guest-modal">
                <button
                  className="btn-close-modal"
                  onClick={() => setActiveSection('')}
                >
                  ×
                </button>
                <GuestPicker
                  onSetGuests={onSetGuests}
                  guests={{ adults, children, infants, pets }}
                />
              </div>
            ) : (
              <Popover style={{ right: 0 }}>
                <GuestPicker
                  onSetGuests={onSetGuests}
                  guests={{ adults, children, infants, pets }}
                />
              </Popover>
            ))}
        </section>
      )}
    </>
  )
}
