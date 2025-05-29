import { Link, useSearchParams } from 'react-router-dom'
import { stayService } from '../services/stay'
import { HeartIcon, StarIcon } from './Icons'
import { formatRating } from '../services/util.service';
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'


export function StayPreview({ stay }) {
  const [searchParams, setSearchParams] = useSearchParams()

  return (
    <article className="stay-preview">
      <Link to={{
        pathname: `/stay/${stay._id}`,
        search: `?${searchParams.toString()}`
      }}>

        <section className="preview-img">
          {/* <img src={stay.imgUrls[0]} alt={stay.name} />
           */}
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

        <button className='btn-like' onClick={(ev) => { ev.preventDefault(); ev.stopPropagation() }}>
          <HeartIcon className="icon-like" />
        </button>

        <section className="preview-details">
          <h2 className='header bold'>{stayService.getStayAddressStr(stay)}</h2>
          <p className='avgRating'>{<StarIcon />}{formatRating(stay.avgRating)}</p>
          <p className='summary regular'>{stay.summary}</p>
          <p className='bed-count regular'>{stay.bedCount} bed{stay.bedCount === 1 ? '' : 's'}</p>
          <p className='price regular'><span className='bold'>${stay.price.toLocaleString()}</span> night</p>
        </section>

      </Link>
    </article >
  )
}