import { AdvancedMarker, APIProvider, Map } from "@vis.gl/react-google-maps"
import { HomeMapMarker } from "./Icons"

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
const ZOOM = 17

export function StayDetailsMap({ location }) {
  const { country, city } = location

  return (
    <section id="location" className="stay-details-map">
      <h3>Where you'll be</h3>
      <p>{`${city}, ${country}`}</p>
      <div className="map-container">

        <APIProvider apiKey={API_KEY}>
          <Map
            defaultZoom={ZOOM}
            mapId='stay-location-map'
            defaultCenter={location}
            gestureHandling={'greedy'}
            disableDefaultUI={false}
          >
            <AdvancedMarker position={location}>
              <HomeMapMarker />
            </AdvancedMarker>
          </Map>
        </APIProvider>
      </div>
    </section>
  )
}