import { Link } from "react-router-dom"
import { StarIcon } from "./Icons"
import { getDateTxt, getPluralSuffix } from "../services/util.service"
import { orderService } from "../services/order"


export function CheckoutBookingDetails({ stay, order }) {
  const { name, avgRating, imgUrls, reviews } = stay
  const { startDate, endDate, guestCountMap, numOfNights } = order

  const totalGuests = orderService.getGuestTotal(guestCountMap)
  const { perNight, nightsTotal, cleaningFee, serviceFee, totalPrice } = orderService.getPriceBreakdown(stay, numOfNights)


  return (
    <section className="checkout-booking-details">
      <header>
        <img src={imgUrls[0]} />
        <h3>{name}</h3>
        <p><StarIcon size="12px" />{avgRating} ({reviews.length})</p>
      </header>

      <section className="cancellation-policy">
        <h4>Free cancellation</h4>
        <p>Cancel up to 48 hours before check-in for a full refund. <Link>Full policy</Link></p>
      </section>

      <section className="trip-details">
        <h4>Trip details</h4>
        <p>{getDateTxt(startDate, endDate)}</p>
        <p>{totalGuests} guest{getPluralSuffix(totalGuests)}</p>
      </section>

      <section className="price-details">
        <h4>Price details</h4>
        <span className="label">${`${perNight.toFixed(2)} x ${numOfNights} night${getPluralSuffix(numOfNights)}`}</span>
        <span className="amount">${`${nightsTotal}`}</span>

        <span className="label">Cleaning fee</span>
        <span className="amount">${cleaningFee.toFixed(2)}</span>

        <span className="label">Rarebnb service fee</span>
        <span className="amount">${`${serviceFee}`}</span>

        <div className="price-total">
          <span className="label">Total USD</span>
          <span className="amount">${`${totalPrice}`}</span>
        </div>
      </section>

    </section>
  )
}