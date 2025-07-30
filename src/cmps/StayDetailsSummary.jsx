import { getHighlightedAmenities } from "../services/StayDetails/amenity-highlights"
import { getPluralSuffix } from "../services/util.service"
import { AmenitiesHighlights } from "./AmenitiesHighlights"
import { ExpandableText } from "./ExpandableText"
import { StarIcon } from "./Icons"


export function StayDetailsSummary({ stay }) {

  const { type, capacity, bedCount, labels, avgRating, host, amenities, reviews } = stay
  const { city, country } = stay.loc

  return (
    <section className="stay-details-summary">
      <header>
        <h3>{type} in {`${city}, ${country}`}</h3>
        <p className="summary-listing-facts">
          <span>{`${capacity} guest${getPluralSuffix(capacity)}`}</span>
          <span>{` ${bedCount} bed${getPluralSuffix(bedCount)}`}</span>
        </p>
        <p className="summary-reviews">
          <StarIcon />
          <span>{avgRating.toFixed(2)}</span>
          <span className="review-count">{reviews.length} reviews</span>
        </p>
      </header>

      <section className="summary-host-info">
        <img src={host.imgUrl} />
        <h4>Hosted by {host.fullname}</h4>
        <p> Superhost · 10 years hosting</p>
      </section>

      <section className="summary-amenities">
        <AmenitiesHighlights highlights={getHighlightedAmenities(amenities)} />
      </section>

      <section className="summary-about">
        <ExpandableText text={stay.summary} limit={250} />
      </section>
    </section >
  )
}