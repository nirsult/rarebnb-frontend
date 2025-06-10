import { useSelector } from "react-redux"
import { NavLink } from "react-router-dom"
import { logout } from "../store/actions/user.actions"
import { showSuccessMsg } from "../services/event-bus.service"


export function HamburgerMenu({ onClose, onLoginClick }) {
  const loggedInUser = useSelector(storeState => storeState.userModule.loggedInUser)

  function handleLoginClick() {
    onClose()
    onLoginClick()
  }

  async function handleLogout() {
    onClose()
    try {
      await logout()
      showSuccessMsg
    } catch {

    }
  }

  return (
    <nav className="hamburger-menu">
      {loggedInUser
        ? <>
          <ul>
            <li><NavLink onClick={onClose} to="/whishlist" >Whishlists</NavLink></li>
            <li><NavLink onClick={onClose} to="/trips" >Trips</NavLink></li>
            <li><NavLink onClick={onClose} to="/dashboard" >Dashboard</NavLink></li>
            <li><NavLink onClick={onClose} to="/reservations" >Reservation</NavLink></li>
          </ul>
          <button className="btn-menu-auth logout" onClick={handleLogout}>Log out</button>
        </>
        : <button className="btn-menu-auth login" onClick={handleLoginClick}>Log in or sign up</button>
      }
    </nav>
  )
}