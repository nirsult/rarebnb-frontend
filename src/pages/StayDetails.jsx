import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { setEmptyOrderToSave, updateOrderToSave } from "../store/actions/order.actions"
import { stayService } from "../services/stay"
import { StayDetailsGallery } from "../cmps/StayDetailsGallery"
import { StayDetailsSummary } from "../cmps/StayDetailsSummary"


export function StayDetails() {
  const { stayId } = useParams()
  const [stay, setStay] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const [isGalleryExpanded, setIsGalleryExpanded] = useState(false)



  const checkIn = searchParams.get('checkIn')
  const checkOut = searchParams.get('checkOut')
  const guests = {
    adults: +searchParams.get('adults'),
    children: +searchParams.get('children'),
    infants: +searchParams.get('infants'),
    pets: +searchParams.get('pets'),
  }

  useEffect(() => {
    if (stayId) loadStay()
  }, [stayId])

  useEffect(() => {
    console.log('stay:', stay)
  }, [stay])

  async function loadStay() {
    try {
      const stay = await stayService.getById(stayId)
      setStay(stay)
      try {
        // TODO - uncomment once moving to creating an order
        // setEmptyOrderToSave(stay)
        // if (checkIn) updateOrderToSave('startDate', new Date(checkIn))
        // if (checkOut) updateOrderToSave('endDate', new Date(checkOut))
        // updateOrderToSave('guestCountMap', guests)

      } catch (err) {
        console.error('Error setting empty order:', err)
      }

    } catch (err) {
      console.error('Error fetching stay:', err)
    }
  }

  if (!stay) return

  if (isGalleryExpanded) return <StayDetailsGallery
    imgUrls={stay.imgUrls}
    isGalleryExpanded={isGalleryExpanded}
    setIsGalleryExpanded={setIsGalleryExpanded}
  />

  return (
    <section className="stay-details">
      <h2>{stay.name}</h2>
      <StayDetailsGallery
        imgUrls={stay.imgUrls}
        isGalleryExpanded={isGalleryExpanded}
        setIsGalleryExpanded={setIsGalleryExpanded}
      />
      <section className="scroll-section">
        <StayDetailsSummary stay={stay} />
      </section>

    </section>
  )
}