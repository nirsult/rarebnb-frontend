import { useSelector } from "react-redux"
import { SkeletonPreviewCard } from "./SkeletonLoaders"
import { StayPreview } from './StayPreview'

export function StayList({ stays }) {
  const isLoading = useSelector((storeState) => storeState.systemModule.isLoading)

  return <section>
    <ul className="list">
      {isLoading
        ? Array.from({ length: 24 }).map((_, idx) => (
          <li key={`skeleton-${idx}`}>
            <SkeletonPreviewCard />
          </li>
        ))
        : stays.map(stay =>
          <li key={stay._id}>
            <StayPreview stay={stay} />
          </li>)
      }
    </ul>
  </section>
}