import { amenityIcons } from "../services/StayDetails/amenity-icons"


export function AmenitiesHighlights({ highlights }) {

  console.log('highlights:', highlights)

  return (
    <section className="amenities-highlights">
      <ul>
        {highlights.map((highlight, idx) => {
          const Icon = amenityIcons[highlight.name]
          return (
            <li key={idx}>
              <span className="highlights-icon">{Icon && <Icon />}</span>
              <h4>{highlight.title}</h4>
              <p>{highlight.desc}</p>
            </li>
          )
        })}
      </ul>
    </section>
  )
}