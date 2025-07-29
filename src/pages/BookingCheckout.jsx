import { useSelector } from "react-redux"
import { FullLeftArrow, VISAicon } from "../cmps/Icons"
import { useNavigate, useParams } from "react-router"
import { useEffect, useState } from "react"
import { stayService } from "../services/stay"
import { Link, useSearchParams } from "react-router-dom"
import { CheckoutBookingDetails } from "../cmps/CheckoutBookingDetails"
import { GlowBtn } from "../cmps/GlowBtn"
import { placeOrder } from "../store/actions/order.actions"
import { showErrorMsg } from "../services/event-bus.service"
import { Loader } from "../cmps/Loader"
import { getOrderDetailsFromSearchParams } from "../services/util.service"
import { orderService } from "../services/order"


export function BookingCheckout() {
  const [stay, setStay] = useState(null)
  const { stayId } = useParams()
  const loggedInUser = useSelector(storeState => storeState.userModule.loggedInUser)
  const [searchParams] = useSearchParams()
  const { startDate, endDate, guestCountMap } = getOrderDetailsFromSearchParams(searchParams)
  const [msgHost, setMsgHost] = useState('')
  const numOfNights = orderService.getNightCount(startDate, endDate)

  const navigate = useNavigate()

  useEffect(() => {
    if (!stayId) return
    async function loadStay() {
      try {
        const stay = await stayService.getById(stayId)
        setStay(stay)
      } catch (err) {
        console.error('Error fetching stay:', err)
      }
    }
    loadStay()
  }, [stayId])

  function onConfirmOrder() {
    placeOrder(orderToSave)
    navigate('/trips')
  }

  if (!stay) return <Loader className="center" />

  const orderToSave = {
    stayId,
    startDate,
    endDate,
    guestCountMap,
    numOfNights,
    ...orderService.calculateOrderFees(stay.price, numOfNights)
  }

  return (
    <>
      <button className="btn-back" onClick={() => navigate(-1)}><FullLeftArrow /></button>
      <section className="booking-checkout">
        <h2>Request to book</h2>

        <section className="confirm-actions-panel">
          <section className="payment-method">
            <h3>1. Add a payment method</h3>
            <p><VISAicon /> 5935 </p>
            <button disabled>change</button>
          </section>

          <section className="msg-host">
            <h3>2. Message the host</h3>
            <p>Share why you're traveling, who's coming with you, and what you love about the space.</p>
            <textarea
              onChange={(ev) => setMsgHost(ev.target.value)}
              value={msgHost}
              placeholder={`Hi ${stay.host.fullname}, I'll be visiting...`}
            ></textarea>
          </section>

          <section className="review-request">
            <h3>3. Review your request</h3>
            <p>The host has 24 hours to confirm your booking. You'll be charged after the request is accepted.</p>
          </section>

          <p className="terms-note">By selecting the button, I agree to the <Link to="#">booking terms</Link>.</p>

          <GlowBtn
            text='Request to book'
            onClick={loggedInUser
              ? onConfirmOrder
              : () => showErrorMsg('You must be logged in to make a reservation.')
            }
          />
        </section>

        <section className="confirm-trip-details">
          <CheckoutBookingDetails
            stay={stay}
            startDate={startDate}
            endDate={endDate}
            guestCountMap={guestCountMap}
            numOfNights={numOfNights}
          />
        </section>

      </section>
    </>

  )
}