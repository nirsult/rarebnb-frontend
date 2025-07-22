import { GlowBtn } from "./GlowBtn"

export function StayDetailsFooterMobile({ stay, checkIn, checkOut, handleReserve }) {

  function handleScrollToWidget() {
    const el = document.getElementById("reservation-widget")
    if (el) {
      el.scrollIntoView({ block: "start" })
    }
  }

  return (
    <footer className="stay-details-footer-mobile">
      <p className="price-per-night">
        <span className="amount">${stay.price}</span>
        <span className="text">night</span>
      </p>
      <GlowBtn
        text={checkIn && checkOut ? 'Reserve' : 'Check availability'}
        onClick={checkIn && checkOut
          ? handleReserve
          : handleScrollToWidget
        } />
    </footer>
  )
}