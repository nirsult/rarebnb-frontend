import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { toggleWishlist } from "../store/actions/user.actions"
import { showErrorMsg } from "../services/event-bus.service"


export function useWishlist(stayId) {
  const loggedInUser = useSelector((storeState) => storeState.userModule.loggedInUser)
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    if (loggedInUser?.wishlist.includes(stayId)) {
      setIsLiked(true)
    } else {
      setIsLiked(false)
    }
  }, [loggedInUser, stayId])

  async function handleWishlistClick(ev) {
    ev.preventDefault()
    ev.stopPropagation()
    if (!loggedInUser) return

    setIsLiked(prev => !prev)

    try {
      await toggleWishlist(stayId)
    } catch (err) {
      setIsLiked(prev => !prev)
      showErrorMsg('Failed to update wishlist')
    }
  }

  return { isLiked, handleWishlistClick }
}