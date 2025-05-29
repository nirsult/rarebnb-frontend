import { useSelector } from 'react-redux'
import { StayList } from '../cmps/StayList'
import { useSearchParams } from 'react-router-dom'
import { LeftArrow, RightArrow } from '../cmps/Icons'
import { useEffect, useState } from 'react'

export function StayIndex() {
  const stays = useSelector((storeState) => storeState.stayModule.stays)
  const totalPages = useSelector((store) => store.stayModule.totalPages)
  const [searchParams, setSearchParams] = useSearchParams()
  const pageIdx = +searchParams.get('pageIdx' || 0)
  const isLoading = useSelector((storeState) => storeState.systemModule.isLoading)
  const [isFirstLoad, setIsFirstLoad] = useState(true)

  useEffect(() => {
    setIsFirstLoad(false)
  }, [])

  function handlePageChange(diff) {
    const nextPage = pageIdx + diff
    if (nextPage < 0) return
    searchParams.set('pageIdx', nextPage)
    setSearchParams(searchParams)
  }

  return (
    <section className="stay-index main-layout">
      {isFirstLoad && (
        <div className="stay-filter-icon-skeleton">
        </div>
      )}

      {isLoading ? (
        <div className="stay-list grid">
        </div>
      ) : (
        <>
          <section className="pagination-controls flex justify-end">
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
          </section>

          <div className="stay-list main-content">
            <StayList stays={stays} />
          </div>
        </>
      )}
    </section>
  )
}
