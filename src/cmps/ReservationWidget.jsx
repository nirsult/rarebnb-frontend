import { Popover } from "./Popover"
import { MyDatePicker } from "./MyDatePicker"
import { GuestPicker } from "./GuestPicker"
import { useEffect, useRef } from "react"
import { GlowBtn } from "./GlowBtn"
import { orderService } from "../services/order"
import { ReportFlag } from "./Icons"
import { useSelector } from "react-redux"


export function ReservationWidget({ stay, checkIn, checkOut, guests, isDatePickerOpen, setIsDatePickerOpen, isGuestPickerOpen, toggleIsGuestPickerOpen, onSetDates, onSetGuests, handleReserve }) {
  const { adults, children, infants, pets } = guests
  const guestTotal = adults + children + infants + pets
  const orderToSave = useSelector(storeState => storeState.orderModule.orderToSave)

  console.log('orderToSave - widget:', orderToSave)

  const datePickerRef = useRef()
  const guestPickerRef = useRef()
  const guestButtonRef = useRef()

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

  return (
    <>
      <div className="card-content">
        {(checkIn && checkOut)
          ? <p>${stay.price} night</p>
          : <h3>Add dates for prices</h3>
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
            <span className="label">Guests</span> {/* //TODO - in scss make sure to capitalize */}
            <span className="value">{`${guestTotal} guest${guestTotal !== 1 ? 's' : ''}`}</span>
          </div>
        </form >

        <GlowBtn
          text={checkIn && checkOut ? 'Reserve' : 'Check availability'}
          onClick={checkIn && checkOut ? handleReserve : () => setIsDatePickerOpen(true)}
        />

        {
          (checkIn && checkOut) &&
          <section className="pricing">
            <p>You won't be charged yet</p>

            <div className="price-breakdown">
              <p className="price-row">
                <span className="label">${stay.price} x {orderService.getNightCount(checkIn, checkOut)} night</span>
                <span className="amount"></span>
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
        <Popover reference={datePickerRef}>
          <MyDatePicker
            onSetDates={onSetDates}
            markedDates={[checkIn, checkOut]}
          />
        </Popover>
      }

      {
        isGuestPickerOpen &&
        <Popover reference={guestPickerRef}>
          <GuestPicker
            guests={guests}
            onSetGuests={onSetGuests}
          />
        </Popover>
      }
    </>
  )
}