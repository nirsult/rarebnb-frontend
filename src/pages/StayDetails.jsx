import { useEffect, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { stayService } from "../services/stay"
import { StayDetailsGallery } from "../cmps/StayDetailsGallery"
import { StayDetailsSummary } from "../cmps/StayDetailsSummary"
import { StayDetailsAmenities } from "../cmps/StayDetailsAmenities"
import { useToggle } from "../customHooks/useToggle"
import { Modal } from "../cmps/Modal"
import { ReservationWidget } from "../cmps/ReservationWidget"
import { getOrderDetailsFromSearchParams } from "../services/util.service"
import { SkeletonDetailsGallery } from "../cmps/SkeletonLoaders"
import { StayDetailsReviews } from "../cmps/StayDetailsReviews"
import { StayDetailsMap } from "../cmps/StayDetailsMap"
import { StayDetailsNav } from "../cmps/StayDetailsNav"
import { useMediaQuery } from "../customHooks/useMediaQuery"
import { StayDetailsGalleryMobile } from "../cmps/StayDetailsGalleryMobile"
import { StayDetailsFooterMobile } from "../cmps/StayDetailsFooterMobile"
import { FullLeftArrow } from "../cmps/Icons"


export function StayDetails() {
  const { stayId } = useParams()
  const [stay, setStay] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const { startDate, endDate, guestCountMap } = getOrderDetailsFromSearchParams(searchParams)
  const isMobile = useMediaQuery('(max-width: 744px)')

  const [isGalleryExpanded, setIsGalleryExpanded] = useState(false)
  const [isAmenitiesModalOpen, toggleIsAmenitiesModalOpen] = useToggle(false)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [isGuestPickerOpen, toggleIsGuestPickerOpen] = useToggle(false)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)

  const [isNavVisible, setIsNavVisible] = useState(false)
  const [isReserveButtonVisible, setIsReserveButtonVisible] = useState(false)

  const [isPageLoading, setIsPageLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (stayId) loadStay()
  }, [stayId])

  async function loadStay() {
    try {
      const stay = await stayService.getById(stayId)
      setStay(stay)
    } catch (err) {
      console.error('Error fetching stay:', err)
    } finally {
      setIsPageLoading(false)
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
    navigate({
      pathname: `/stay/${stay._id}/checkout`,
      search: `${searchParams.toString()}`
    })
  }

  if (isPageLoading) return <SkeletonDetailsGallery />
  if (!stay) return <div>Stay not found.</div>

  const { name, imgUrls, amenities } = stay

  if (isGalleryExpanded) return <StayDetailsGallery
    imgUrls={imgUrls}
    isGalleryExpanded={isGalleryExpanded}
    setIsGalleryExpanded={setIsGalleryExpanded}
  />

  return (
    <>
      {isNavVisible &&
        <StayDetailsNav
          stay={stay}
          checkIn={startDate}
          checkOut={endDate}
          handleReserve={handleReserve}
          setIsDatePickerOpen={setIsDatePickerOpen}
          isReserveButtonVisible={isReserveButtonVisible}
        />
      }
      <section className={`stay-details ${isMobile ? 'full main-layout' : ''}`}>
        <button
          onClick={() => navigate(-1)}
          className="btn-back"
        >
          <FullLeftArrow />
        </button>
        {!isMobile && <h2>{name}</h2>}


        {isMobile
          ? <StayDetailsGalleryMobile imgUrls={imgUrls} />
          : <StayDetailsGallery
            imgUrls={imgUrls}
            isGalleryExpanded={isGalleryExpanded}
            setIsGalleryExpanded={setIsGalleryExpanded}
            setIsNavVisible={setIsNavVisible}
          />}

        <div className="details-page-content">
          {isMobile && <h2>{name}</h2>}
          <section className="scroll-section">
            <div className="main-column">
              <StayDetailsSummary stay={stay} />

              <section id="amenities" className="stay-details-amenities">
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

            <div id="reservation-widget" className="reservation-column">
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
                  setIsReserveButtonVisible={setIsReserveButtonVisible}
                  isMobile={isMobile}
                />
              </section>
            </div>
          </section>



          <StayDetailsReviews
            stay={stay}
            reviews={stay.reviews}
            isModalOpen={isReviewModalOpen}
            setIsReviewModalOpen={setIsReviewModalOpen}
          />

          {isReviewModalOpen && (
            <Modal onClose={() => setIsReviewModalOpen(false)}>
              <StayDetailsReviews
                reviews={stay.reviews}
                isModalOpen={isReviewModalOpen}
              />
            </Modal>
          )}

          <StayDetailsMap location={stay.loc} />

        </div >

        {isMobile &&
          <StayDetailsFooterMobile
            stay={stay}
            checkIn={startDate}
            checkOut={endDate}
            handleReserve={handleReserve}
          />
        }
      </section >

    </>
  )
}