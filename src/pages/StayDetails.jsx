import { useEffect, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { setEmptyOrderToSave, updateOrderToSave } from "../store/actions/order.actions"
import { stayService } from "../services/stay"
import { StayDetailsGallery } from "../cmps/StayDetailsGallery"
import { StayDetailsSummary } from "../cmps/StayDetailsSummary"
import { StayDetailsAmenities } from "../cmps/StayDetailsAmenities"
import { useToggle } from "../customHooks/useToggle"
import { Modal } from "../cmps/Modal"
import { ReservationWidget } from "../cmps/ReservationWidget"
import { orderService } from "../services/order"
import { getOrderDetailsFromSearchParams } from "../services/util.service"


export function StayDetails() {
  const { stayId } = useParams()
  const [stay, setStay] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const { startDate, endDate, guestCountMap } = getOrderDetailsFromSearchParams(searchParams)

  const [isGalleryExpanded, setIsGalleryExpanded] = useState(false)
  const [isAmenitiesModalOpen, toggleIsAmenitiesModalOpen] = useToggle(false)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [isGuestPickerOpen, toggleIsGuestPickerOpen] = useToggle(false)

  const navigate = useNavigate()

  useEffect(() => {
    if (stayId) loadStay()
  }, [stayId])

  useEffect(() => {
    if (!stay) return

    const { startDate, endDate, guestCountMap } = getOrderDetailsFromSearchParams(searchParams)
    const numOfNights = orderService.getNightCount(startDate, endDate)
    if (!stay?.price || numOfNights <= 0) return

    const orderFees = orderService.calculateOrderFees(stay.price, numOfNights)
    updateOrderToSave({
      startDate,
      endDate,
      guestCountMap,
      numOfNights,
      ...orderFees
    })
  }, [searchParams, stay])

  async function loadStay() {
    try {
      const stay = await stayService.getById(stayId)
      setStay(stay)
      try {
        setEmptyOrderToSave(stay)
      } catch (err) {
        console.error('Error setting empty order:', err)
      }

    } catch (err) {
      console.error('Error fetching stay:', err)
    }
  }

  function onSetDates({ checkIn, checkOut }) {
    const params = new URLSearchParams(searchParams)
    if (checkIn) params.set('checkIn', checkIn.toString())
    else (params.delete('checkIn'))

    if (checkOut) params.set('checkOut', checkOut.toString())
    else (params.delete('checkOut'))

    setSearchParams(params)
    if (checkIn && checkOut) setIsDatePickerOpen(false)
  }

  function onSetGuests(guests) {
    const params = new URLSearchParams(searchParams)

    Object.entries(guests).forEach(([key, value]) => {
      if (value > 0) params.set(key, value)
      else params.delete(key)
    })
    setSearchParams(params)
  }

  function handleReserve() {
    console.log('Handling Reserve :)')
    navigate(`/stay/${stay._id}/checkout`)
  }

  if (!stay) return

  const { name, imgUrls, amenities } = stay

  if (isGalleryExpanded) return <StayDetailsGallery
    imgUrls={imgUrls}
    isGalleryExpanded={isGalleryExpanded}
    setIsGalleryExpanded={setIsGalleryExpanded}
  />

  return (
    <section className="stay-details">
      <h2>{name}</h2>
      <StayDetailsGallery
        imgUrls={imgUrls}
        isGalleryExpanded={isGalleryExpanded}
        setIsGalleryExpanded={setIsGalleryExpanded}
      />

      <section className="scroll-section">
        <div className="main-column">
          <StayDetailsSummary stay={stay} />

          <section className="stay-details-amenities">
            <StayDetailsAmenities
              amenities={amenities}
              isAmenitiesModalOpen={isAmenitiesModalOpen}
              limit={10}
            />

            {amenities.length > 10 &&
              <button
                className="btn-secondary"
                onClick={toggleIsAmenitiesModalOpen}
              >
                Show all {amenities.length} amenities
              </button>
            }

            {isAmenitiesModalOpen && (
              <Modal onClose={() => toggleIsAmenitiesModalOpen(false)}>
                <StayDetailsAmenities
                  amenities={amenities} />
              </Modal>
            )}
          </section>
        </div>

        <div className="reservation-column">
          <section className="reservation-widget">
            <ReservationWidget
              stay={stay}
              checkIn={startDate}
              checkOut={endDate}
              guests={guestCountMap}
              isDatePickerOpen={isDatePickerOpen}
              setIsDatePickerOpen={setIsDatePickerOpen}
              isGuestPickerOpen={isGuestPickerOpen}
              onSetDates={onSetDates}
              onSetGuests={onSetGuests}
              toggleIsGuestPickerOpen={toggleIsGuestPickerOpen}
              handleReserve={handleReserve}
            />
          </section>
        </div>

      </section>
    </section>
  )
}