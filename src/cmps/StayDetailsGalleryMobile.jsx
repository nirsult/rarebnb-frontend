import { Swiper, SwiperSlide } from "swiper/react"
import 'swiper/css'

export function StayDetailsGalleryMobile({ imgUrls }) {

  return (
    <section className="stay-details-gallery-mobile full">
      <Swiper className="swiper">
        {imgUrls.map((url, idx) => {
          return (
            <SwiperSlide key={idx}>
              <img src={url} />
            </SwiperSlide>)
        })}
      </Swiper>
    </section>
  )
}