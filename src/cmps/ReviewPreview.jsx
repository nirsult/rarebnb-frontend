import { formatDate } from "../services/util.service"
import { ExpandableText } from "./ExpandableText"
import { StarIcon } from "./Icons"


export function ReviewPreview({ review, isModalOpen }) {
  const { at, by, rate, txt } = review

  return (
    <article className="review-preview">
      <header className="reviewer-info">
        <img src={by.imgUrl} alt="reviewer profile picture" />
        <h4 className="reviewr-name">{by.fullname}</h4>
        <p>Traveler</p>
      </header>

      <h5>
        <span className="stars-container">
          <span className="full-stars">
            {Array.from({ length: rate }, (_, i) => (
              <StarIcon key={i} />
            ))}
          </span>
          <span className="empty-stars">
            {Array.from({ length: 5 - rate }, (_, i) => (
              <StarIcon key={i} />
            ))}
          </span>
        </span>
        <span className="date">{formatDate(at)}</span>
      </h5>

      {isModalOpen
        ? <p>{txt}</p>
        : <ExpandableText text={txt} limit={140} />
      }
    </article>
  )
}