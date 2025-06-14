import { TVIcon, WifiIcon } from "../../cmps/Icons"

const HIGHLIGHTABLE_AMENITIES = {
  Wifi: {
    // icon: <WifiIcon />,
    title: 'Fast wifi',
    desc: 'Guests often say the wifi is fast.',
  },
  TV: {
    // icon: <TVIcon />,
    title: 'Smart TV',
    desc: 'Stream your favorites with built-in apps.',
  },
  'Air conditioning': {
    // icon: <AirConditioningIcon />,
    title: 'Stay cool',
    desc: 'This place has air conditioning for your comfort.',
  }
}

export function getHighlightedAmenities(stayAmenities) {
  const amenitiesToReturn = []
  for (let key in HIGHLIGHTABLE_AMENITIES) {
    if (amenitiesToReturn.length === 3) break

    if (stayAmenities.some(amenity => amenity.toLowerCase() === key.toLowerCase())) {
      amenitiesToReturn.push({ name: key, ...HIGHLIGHTABLE_AMENITIES[key] })
    }
  }

  return amenitiesToReturn
}