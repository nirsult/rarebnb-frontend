import { useEffect, useState } from "react"
import { MagnifyingGlassIcon, XIcon } from "./Icons"
import { GuestPicker } from "./GuestPicker"
import { GlowBtn } from "./GlowBtn"
import { MyDatePicker } from "./MyDatePicker"
import { formatDate, getPluralSuffix } from "../services/util.service"
import { stayService } from "../services/stay"
import { orderService } from "../services/order"


export function StayFilterMobile({ filterBy, setSearchParams }) {
  const [isOpen, setIsOpen] = useState(false)
  const [openSection, setOpenSection] = useState('')
  const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

  useEffect(() => {
    if (isOpen) document.body.classList.add('modal-open')

    return () => {
      document.body.classList.remove('modal-open')
    }
  }, [isOpen])

  function onSetGuests(guests) {
    const total = orderService.getGuestTotal(guests)
    setFilterByToEdit(prev => ({ ...prev, ...guests, guestTotal: total }))
  }

  function getSectionClass(id, openSection) {
    return `accordion-section ${openSection === id ? 'active' : ''}`
  }

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

  function handleSearch() {
    setIsOpen(false)
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
    <section className="stay-filter-mobile">
      {!isOpen &&
        <button
          className="btn-search btn-reset"
          onClick={() => {
            setIsOpen(true)
            setOpenSection('where')
          }}
        >
          <MagnifyingGlassIcon />
          Start your search
        </button>
      }

      {isOpen && (
        <div className="accordion-filter">
          <button className="btn-accordion-close" onClick={() => setIsOpen(false)}><XIcon /></button>

          <div
            className={getSectionClass('where', openSection)}
            onClick={() => setOpenSection('where')}
          >
            {openSection === 'where'
              ? <>
                <h2>Where?</h2>
                <input type="text"
                  placeholder="Search destinations"
                  onChange={handleChange}
                  value={country}
                  name="country"
                  className="input-search"
                />
              </>
              : <>
                <span>Where</span>
                <span>{country
                  ? country : 'I\'m flexible'}
                </span>
              </>
            }
          </div>

          <div
            className={getSectionClass('when', openSection)}
            onClick={() => setOpenSection('when')}
          >
            {openSection === 'when'
              ? <>
                <h2>When?</h2>
                <MyDatePicker
                  onSetDates={handleDateChange}
                  markedDates={[checkIn, checkOut]}
                  monthsShown={1}
                  className="wide"
                  isMobile={true}
                />
              </>
              : <>
                <span>When</span>
                <span>{(checkIn && checkOut)
                  ? `${formatDate(checkIn)} - ${formatDate(checkOut)}` : 'Add dates'}
                </span>
              </>
            }
          </div>

          <div
            className={`guests ${getSectionClass('who', openSection)}`}
            onClick={() => setOpenSection('who')}
          >
            {openSection === 'who'
              ? <>
                <h2>Who?</h2>
                <GuestPicker
                  onSetGuests={onSetGuests}
                  guests={{ adults, children, infants, pets }}
                  className={'flat'} />
              </>
              : <>
                <span>Who</span>
                <span>{totalGuests
                  ? `${totalGuests} guest${getPluralSuffix(totalGuests)}` : 'Add guests'}
                </span>
              </>
            }
          </div>

          <footer>
            <button
              onClick={() =>
                setFilterByToEdit(stayService.getDefaultFilter())}
              className="btn-clear btn-reset"
            >
              Clear all
            </button>
            <GlowBtn
              text={
                <>
                  <MagnifyingGlassIcon />
                  Search
                </>}
              className="btn-search"
              onClick={handleSearch}
            />
          </footer>
        </div>
      )
      }
    </section >
  )
}