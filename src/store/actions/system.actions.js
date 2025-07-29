import { SET_LOGIN_MODAL } from "../reducers/system.reducer"
import { store } from "../store"


export function setLoginModal(isOpen) {
  store.dispatch({ type: SET_LOGIN_MODAL, isOpen })
}