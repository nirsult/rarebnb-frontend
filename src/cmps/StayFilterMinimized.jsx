import { getDateTxt } from "../services/util.service"
import { MagnifyingGlassIcon } from "./Icons"


export function StayFilterMinimized({ filterBy, isHidden, setIsHeaderExpanded, setActiveSection }) {

  const { city, country, checkIn, checkOut, guestTotal } = filterBy

  function handleClick(clickedSection) {
    setActiveSection(clickedSection)
    setIsHeaderExpanded(true)
  }

  return (
    <section className={`filter-minimized ${isHidden ? 'dis-none' : 'flex'}`}>
      <section className="location flex align-center" onClick={() => handleClick('location')}>
        <img className="icon-homes" src="https://res.cloudinary.com/dbbj46yzt/image/upload/v1747242745/4aae4ed7-5939-4e76-b100-e69440ebeae4.png_im_w_240_zptu40.avif" />
        {city || country
          ? <p>Homes in {city || country}</p>
          : <p>Anywhere</p>
        }
      </section>
      <section className="dates" onClick={() => handleClick('check-in')}>
        {checkIn && checkOut
          ? <p>{getDateTxt(checkIn, checkOut)}</p>
          : <p>Anytime</p>
        }
      </section>
      <section className="guests"  onClick={() => handleClick('guests')}>
        {guestTotal > 0
          ? <p>{guestTotal} guest{guestTotal > 1 ? 's' : ''}</p>
          : <p>Add guests</p>
        }
      </section>
      <section className="btn-search search-icon">
        <MagnifyingGlassIcon width="12px" height="12px" />
      </section>
    </section>
  )
}