import { useSelector } from "react-redux"
import { LeftArrow } from "../cmps/Icons"
import { useNavigate } from "react-router"


export function BookingCheckout() {
  const orderToSave = useSelector(storeState => storeState.orderModule.orderToSave)
  const navigate = useNavigate()

  // console.log('orderToSave:', orderToSave)



  return (
    <section className="booking-checkout">
      <h2>Request to book</h2>
      <button onClick={() => navigate(-1)}><LeftArrow /></button>
    </section>
  )
}