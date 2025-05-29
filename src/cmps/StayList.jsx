import { StayPreview } from './StayPreview'

export function StayList({ stays }) {

  return <section>
    <ul className="list">
      {stays.map(stay =>
        <li key={stay._id}>
          <StayPreview stay={stay} />
        </li>)
      }
    </ul>
  </section>
}