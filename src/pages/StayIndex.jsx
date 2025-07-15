import { useSelector } from 'react-redux'
import { StayList } from '../cmps/StayList'
import { useSearchParams } from 'react-router-dom'
import { LeftArrow, RightArrow } from '../cmps/Icons'

export function StayIndex() {
  const stays = useSelector((storeState) => storeState.stayModule.stays)
  const totalPages = useSelector((store) => store.stayModule.totalPages)
  const [searchParams, setSearchParams] = useSearchParams()
  const pageIdx = +searchParams.get('pageIdx' || 0)

  function handlePageChange(diff) {
    const nextPage = pageIdx + diff
    if (nextPage < 0) return
    searchParams.set('pageIdx', nextPage)
    setSearchParams(searchParams)
    window.scrollTo({ top: 0 })
  }

  return (
    <section className="stay-index">

      <section className="pagination-controls">
        <button
          onClick={() => handlePageChange(-1)}
          disabled={pageIdx === 0}
        >
          <LeftArrow />
        </button>
        <button
          onClick={() => handlePageChange(1)}
          disabled={pageIdx === totalPages - 1}
        >
          <RightArrow />
        </button>
      </section >

      <div className="stay-list main-content">
        <StayList stays={stays} />
      </div>

      <section className="pagination-controls bottom">
        <button
          onClick={() => handlePageChange(-1)}
          disabled={pageIdx === 0}
        >
          <LeftArrow />
        </button>
        <button
          onClick={() => handlePageChange(1)}
          disabled={pageIdx === totalPages - 1}
        >
          <RightArrow />
        </button>
      </section >
    </section >
  )
}
