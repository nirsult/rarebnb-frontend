import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { loadWishlistsStays } from "../store/actions/stay.actions"
import { StayList } from "../cmps/StayList"


export function Wishlists() {
  const loggedInUser = useSelector((storeState) => storeState.userModule.loggedInUser)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const wishlistsStays = useSelector((storeState) => storeState.stayModule.wishlistsStays)


  useEffect(() => {
    async function fetchStays() {
      setIsPageLoading(true)
      try {
        if (!loggedInUser?.wishlist?.length > 0) return
        await loadWishlistsStays({ ids: [...loggedInUser.wishlist] })
      } catch (err) {
        console.log('Failed to fetch stays', err)
      } finally {
        setIsPageLoading(false)
      }
    }

    fetchStays()

  }, [])

  return (
    <section className="wishlists">
      <StayList stays={wishlistsStays} />
    </section>
  )
}