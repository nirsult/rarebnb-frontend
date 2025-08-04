import { Link, useSearchParams } from 'react-router-dom'
import { stayService } from '../services/stay'
import { HeartIcon, StarIcon } from './Icons'
import { formatRating, getPluralSuffix } from '../services/util.service'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { useSelector } from "react-redux"
import { toggleWishlist } from "../store/actions/user.actions"
import { useEffect, useState } from "react"
import { showErrorMsg } from "../services/event-bus.service"


export function StayPreview({ stay }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const loggedInUser = useSelector((storeState) => storeState.userModule.loggedInUser)
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    if (loggedInUser?.wishlist.includes(stay._id)) {
      setIsLiked(true)
    } else {
      setIsLiked(false)
    }
  }, [loggedInUser, stay._id])

  async function handleWishlistClick(ev, stayId) {
    ev.preventDefault()
    ev.stopPropagation()
    if (!loggedInUser) return

    setIsLiked(prev => !prev)

    try {
      await toggleWishlist(stayId)
    } catch (err) {
      console.log('HERE')
      setIsLiked(prev => !prev)
      showErrorMsg('Failed to update wishlist')
    }
  }

  return (
    <article className="stay-preview">
      <Link to={{
        pathname: `/stay/${stay._id}`,
        search: `?${searchParams.toString()}`
      }}>

        <section className="preview-img">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            loop={false}
            className="swiper"
          >
            {stay.imgUrls.map((url, idx) => (
              <SwiperSlide key={idx}>
                <img src={url} alt={`${stay.name} image ${idx + 1}`} />
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        <button className='btn-like' onClick={(ev) => handleWishlistClick(ev, stay._id)}>
          <HeartIcon className={`icon-like ${isLiked ? 'liked' : ''}`} />
        </button>

        <section className="preview-details">
          <h2 className='header bold'>{stayService.getStayAddressStr(stay)}</h2>
          <p className='avgRating'>{<StarIcon />}{formatRating(stay.avgRating)}</p>
          <p className='summary regular'>{stay.summary}</p>
          <p className='bed-count regular'>{stay.bedCount} bed{getPluralSuffix(stay.bedCount)}</p>
          <p className='price regular'><span className='bold'>${stay.price.toLocaleString()}</span> night</p>
        </section>

      </Link>
    </article >
  )
}