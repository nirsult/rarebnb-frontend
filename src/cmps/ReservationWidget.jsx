import { Popover } from "./Popover"
import { MyDatePicker } from "./MyDatePicker"
import { GuestPicker } from "./GuestPicker"
import { useEffect, useRef, useState } from "react"
import { GlowBtn } from "./GlowBtn"
import { orderService } from "../services/order"
import { ReportFlag, UpArrow } from "./Icons"
import { formatPrice, getPluralSuffix } from "../services/util.service"


export function ReservationWidget({ stay, checkIn, checkOut, guests, isDatePickerOpen, setIsDatePickerOpen, isGuestPickerOpen, toggleIsGuestPickerOpen, onSetDates, onSetGuests, handleReserve, setIsReserveButtonVisible, isMobile }) {
  const { adults, children, infants, pets } = guests
  const guestTotal = adults + children + infants + pets

  const [nightCount, setNightCount] = useState(orderService.getNightCount(checkIn, checkOut))
  const [priceBreakdown, setPriceBreakdown] = useState(orderService.getPriceBreakdown(stay, nightCount))

  const datePickerRef = useRef()
  const guestPickerRef = useRef()
  const guestButtonRef = useRef()
  const reserveButtonRef = useRef()

  useEffect(() => {
    if (!reserveButtonRef.current) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsReserveButtonVisible(entry.isIntersecting)
    },
      { rootMargin: '-80px 0px 0px 0px' })

    observer.observe(reserveButtonRef.current)

    return () => observer.disconnect()
  }, [])


  useEffect(() => {
    const newNightCount = orderService.getNightCount(checkIn, checkOut)
    const newPriceBreakdown = orderService.getPriceBreakdown(stay, newNightCount)

    setNightCount(newNightCount)
    setPriceBreakdown(newPriceBreakdown)
  }, [stay, checkIn, checkOut])

  useEffect(() => {
    function handleClickOutside(ev) {
      if (isDatePickerOpen && datePickerRef.current && !datePickerRef.current.contains(ev.target)) {
        setIsDatePickerOpen(false)
      }
      if (isGuestPickerOpen && guestPickerRef.current && !guestPickerRef.current.contains(ev.target) && !guestButtonRef.current.contains(ev.target)) {
        toggleIsGuestPickerOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDatePickerOpen, isGuestPickerOpen])

  function handleSectionClick(section) {
    if (section === 'date') {
      setIsDatePickerOpen(true)
      if (isGuestPickerOpen) toggleIsGuestPickerOpen(false)
    } else if (section === 'guest') {
      toggleIsGuestPickerOpen()
      if (isDatePickerOpen) setIsDatePickerOpen(false)
    }
  }

  const { perNight, nightsTotal, serviceFee, cleaningFee, totalPrice } = priceBreakdown || {}

  return (
    <>
      <div className="card-content">
        {(checkIn && checkOut)
          ? <h3 className="price-per-night"><span className="amount">${stay.price}</span><span className="night">night</span></h3>
          : <h3 className="add-dates-note">Add dates for prices</h3>
        }

        <form>
          <div className="input-cell" onClick={() => handleSectionClick('date')}>
            <span className="label">Check-in</span>
            <span className={`value ${checkIn ? '' : 'placeholder'}`}>{checkIn?.toLocaleDateString() || 'Add date'}</span>
          </div>

          <div className="input-cell" onClick={() => handleSectionClick('date')}>
            <span className="label">Checkout</span>
            <span className={`value ${checkOut ? '' : 'placeholder'}`}>{checkOut?.toLocaleDateString() || 'Add date'}</span>
          </div>

          <div className="input-cell" ref={guestButtonRef} onClick={() => handleSectionClick('guest')}>
            <span className="label">Guests</span>
            <span className="value">{`${guestTotal} guest${guestTotal !== 1 ? 's' : ''}`}</span>
            <UpArrow className={isGuestPickerOpen ? '' : 'close'} />
          </div>
        </form >

        <GlowBtn
          text={checkIn && checkOut ? 'Reserve' : 'Check availability'}
          onClick={checkIn && checkOut ? handleReserve : () => setIsDatePickerOpen(true)
          }
          btnRef={reserveButtonRef}
        />

        {
          (checkIn && checkOut) &&
          <section className="pricing">
            <p>You won't be charged yet</p>

            <div className="price-breakdown">
              <p className="price-row">
                <span className="label">${formatPrice(perNight)} x {nightCount} night{getPluralSuffix(nightCount)}</span>
                <span className="amount">${formatPrice(nightsTotal)}</span>
              </p>
              <p className="price-row">
                <span className="label">Cleaning fee</span>
                <span className="amount">${formatPrice(cleaningFee)}</span>
              </p>
              <p className="price-row">
                <span className="label">Rarebnb service fee</span>
                <span className="amount">${formatPrice(serviceFee)}</span>
              </p>
              <p className="price-row">
                <span className="label">Total</span>
                <span className="amount">${formatPrice(totalPrice)}</span>
              </p>
            </div>
          </section>
        }
      </div >

      <p className="report">
        <ReportFlag />
        <span className="text">Report this listing</span>
      </p>

      {
        isDatePickerOpen &&
        <Popover
          reference={datePickerRef}
          style={isMobile ? { width: '100%' } : { top: '10%', right: '0' }}
        >
          <MyDatePicker
            onSetDates={onSetDates}
            markedDates={[checkIn, checkOut]}
            monthsShown={isMobile ? 1 : 2}
          />
        </Popover >
      }

      {
        isGuestPickerOpen &&
        <Popover
          reference={guestPickerRef}
          style={{ top: '51%', right: '0' }}
        >
          <GuestPicker
            guests={guests}
            onSetGuests={onSetGuests}
          />
        </Popover>
      }
    </>
  )
}