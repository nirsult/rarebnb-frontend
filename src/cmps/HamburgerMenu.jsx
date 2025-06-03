import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";


export function HamburgerMenu({ onClose, onLoginClick }) {
  const loggedInUser = useSelector(storeState => storeState.userModule.loggedInUser)

  function handleLoginClick() {
    onClose()
    onLoginClick()
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
          <button className="btn-menu-auth logout" onClick={onClose}>Log out</button>
        </>
        : <button className="btn-menu-auth login" onClick={handleLoginClick}>Log in or sign up</button>
      }


    </nav>
  )
}