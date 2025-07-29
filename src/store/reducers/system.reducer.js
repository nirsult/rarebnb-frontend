export const LOADING_START = 'LOADING_START'
export const LOADING_DONE = 'LOADING_DONE'
export const SET_LOGIN_MODAL = 'SET_LOGIN_MODAL'

const initialState = {
  isLoading: false,
  isLoginModalOpen: false
}

export function systemReducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOADING_START:
      return { ...state, isLoading: true }
    case LOADING_DONE:
      return { ...state, isLoading: false }
    case SET_LOGIN_MODAL:
      return { ...state, isLoginModalOpen: action.isOpen }
    default: return state
  }
}
