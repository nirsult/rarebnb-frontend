import { amenityIcons } from "../services/StayDetails/amenity-icons"


export function StayDetailsAmenities({ amenities, limit }) {
  const amenitiesToDisplay = limit ? amenities.slice(0, limit) : amenities

  return (
    <>
      <h3>What this place offers</h3>
      <ul>
        {amenitiesToDisplay.map((amenity, idx) => {
          const Icon = amenityIcons[amenity]
          return (
            <li key={idx}>
              <span className="amenity-icon">{Icon && <Icon />}</span>
              {amenity}
            </li>
          )
        })}
      </ul>
    </>
  )
}