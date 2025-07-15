import { formatRating, getPluralSuffix } from "../services/util.service"
import { StarIcon } from "./Icons"
import { ReviewPreview } from "./ReviewPreview"

const REVIEWS_PREVIEW_COUNT = 6

export function StayDetailsReviews({ stay, reviews, isModalOpen, setIsReviewModalOpen }) {
  const reviewsToDisplay = isModalOpen ? reviews : reviews.slice(0, REVIEWS_PREVIEW_COUNT)

  return (
    <section id="reviews" className="stay-details-reviews">

      {isModalOpen
        ? <h3 className="reviews-modal">Reviews</h3>
        : <section className="guest-favorite">
          <h3>
            <img src="https://res.cloudinary.com/dbbj46yzt/image/upload/v1752494284/leftLeavesBlack_y82y7d.avif" alt="" />
            <div className="avg-rating">
              {formatRating(stay.avgRating)}
            </div>
            <img src="https://res.cloudinary.com/dbbj46yzt/image/upload/v1752494284/rightLeavesBlack_bcxt1x.avif" alt="" />
          </h3>

          <div className="text-container">
            <h4>Guest favorite</h4>
            <p>This home is a guest favorite based on ratings, reviews, and reliability</p>
          </div>
        </section>
      }

      {reviewsToDisplay.map((review, idx) => (
        <ReviewPreview
          key={idx}
          review={review}
          isModalOpen={isModalOpen}
        />
      ))}

      {!isModalOpen && reviews.length > REVIEWS_PREVIEW_COUNT &&
        <button className="btn-secondary show-all" onClick={() => setIsReviewModalOpen(true)}>
          Show all {reviews.length} reviews
        </button>}

    </section>
  )
}