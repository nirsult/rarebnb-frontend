import { useEffect, useRef, useState } from "react"
import { GuestPicker } from "./GuestPicker"
import { Popover } from "./Popover"
import { MagnifyingGlassIcon } from "./Icons"
import { MyDatePicker } from "./MyDatePicker"
import { formatDate, getPluralSuffix } from "../services/util.service"
import { useSearchParams } from "react-router-dom"
import { orderService } from "../services/order"


export function StayFilterExpanded({ filterBy, activeSection, setActiveSection }) {
  const [filterByToEdit, setFilterByToEdit] = useState(filterBy)
  const isFocused = !!activeSection
  const filterBarRef = useRef()
  const locationInputRef = useRef()
  const [searchParams, setSearchParams] = useSearchParams()

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
    setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
  }

  function handleDateChange({ checkIn, checkOut }) {
    setFilterByToEdit(prev => ({
      ...prev,
      checkIn,
      checkOut
    }))
  }

  function onSetGuests(guests) {
    const total = orderService.getGuestTotal(guests)
    setFilterByToEdit(prev => ({ ...prev, ...guests, guestTotal: total }))
  }

  function handleSearch(ev) {
    ev.preventDefault()
    ev.stopPropagation()
    setActiveSection('')
    const params = new URLSearchParams()
    for (const key in filterByToEdit) {
      const val = filterByToEdit[key]
      if (val !== '' && val !== 0) {
        params.set(key, val)
      }
    }
    setSearchParams(params)
  }

  const { country, checkIn, checkOut, adults, children, infants, pets } = filterByToEdit
  const totalGuests = adults + children + infants + pets

  return (
    <section ref={filterBarRef} className={`filter-bar ${isFocused ? 'focused' : ''}`}>
      <button
        className={`btn-filter btn-location ${activeSection === 'location' ? 'active' : ''}`}
        onClick={() => setActiveSection('location')}
      >
        <div className="btn-content">
          <label htmlFor="country" className="btn-label">Where</label>
          <input value={country} onChange={handleChange} ref={locationInputRef}
            type="text" placeholder="Search destinations" id="country" name="country"
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
        className={`btn-filter btn-check-in ${activeSection === 'check-in' ? 'active' : ''}`}
        onClick={() => setActiveSection('check-in')}
      >
        <div className="btn-content">
          <span className="btn-label">Check in</span>
          <span className="btn-value">{checkIn ? formatDate(checkIn) : 'Add dates'}</span>
        </div>
      </button>

      <button
        className={`btn-filter btn-check-out ${activeSection === 'check-out' ? 'active' : ''}`}
        onClick={() => setActiveSection('check-out')}
      >
        <div className="btn-content">
          <span className="btn-label">Check out</span>
          <span className="btn-value">{checkOut ? formatDate(checkOut) : 'Add dates'}</span>
        </div>
      </button>

      <button className={`btn-filter btn-guests ${activeSection === 'guests' ? 'active' : ''}`} onClick={() => setActiveSection('guests')}>
        <div className="btn-content">
          <span className="btn-label">Who</span>
          <span className="btn-value">
            {totalGuests > 0 ? `${totalGuests} guest${getPluralSuffix(totalGuests)}` : 'Add guests'}
          </span>
        </div>
        <button
          className={`search-icon ${isFocused ? 'expanded' : ''}`}
          onClick={handleSearch}>
          <MagnifyingGlassIcon />
          <span className="search-label">Search</span>
        </button>
      </button>

      {
        (activeSection === 'check-in' || activeSection === 'check-out') && (
          <Popover style={{ left: '50%', transform: 'translateX(-50%)', width: '100%' }}>
            <MyDatePicker
              onSetDates={handleDateChange}
              setActiveSection={setActiveSection}
              markedDates={[filterByToEdit.checkIn, filterByToEdit.checkOut]}
            />
          </Popover>
        )
      }

      {activeSection === 'guests' && (
        <Popover style={{ right: 0, width: '26.625rem' }}>
          <GuestPicker
            onSetGuests={onSetGuests}
            guests={{ adults, children, infants, pets }}
          />
        </Popover>
      )
      }
    </section >
  )
}