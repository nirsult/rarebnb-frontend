import { GlowBtn } from "./GlowBtn"
import { StarIcon } from "./Icons"


export function StayDetailsNav({ stay, checkIn, checkOut, handleReserve, setIsDatePickerOpen, isReserveButtonVisible }) {
  const { price, avgRating, reviews } = stay

  return (
    <nav className="stay-details-nav full">
      <div className="content-container">

        <a href="#photos">Photos</a>
        <a href="#amenities">Amenities</a>
        <a href="#reviews">Reviews</a>
        <a href="#location">Location</a>

        {!isReserveButtonVisible &&
          <div className="reserve">
            <p className="price-per-night">
              <span className="amount">${price} </span>
              <span>night</span>
            </p>
            <p className="reviews-summary">
              <span className="avg-rating"><StarIcon />{avgRating}</span>
              <span className="review-count">{reviews.length} reviews</span>
            </p>
            <GlowBtn
              text={checkIn && checkOut ? 'Reserve' : 'Check availability'}
              onClick={checkIn && checkOut
                ? handleReserve
                : () => {
                  const el = document.getElementById('reservation-widget')
                  if (el) {
                    el.scrollIntoView({ block: 'start' })
                  }
                  setIsDatePickerOpen(true)
                }
              } />
          </div>
        }
      </div>

    </nav>
  )
}