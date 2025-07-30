import { stayService } from "../../services/stay"
import { store } from "../store"
import { ADD_STAY, REMOVE_STAY, SET_STAYS, SET_STAY, UPDATE_STAY, ADD_STAY_MSG, SET_PAGINATION } from "../reducers/stay.reducer"
import { LOADING_START, LOADING_DONE } from "../reducers/system.reducer"

export async function loadStays(filterBy) {
  store.dispatch({ type: LOADING_START })
  try {
    const res = await stayService.query(filterBy)
    store.dispatch(getCmdSetStays(res.stays))
    store.dispatch(getCmdSetPagination(res.pageIdx, res.totalPages))
  } catch (err) {
    console.error("Cannot load stays", err)
  } finally {
    store.dispatch({ type: LOADING_DONE })
  }
}

export async function loadStay(stayId) {
  try {
    const stay = await stayService.getById(stayId)
    store.dispatch(getCmdSetStay(stay))
  } catch (err) {
    console.log("Cannot load stay", err)
    throw err
  }
}

export async function removeStay(stayId) {
  try {
    await stayService.remove(stayId)
    store.dispatch(getCmdRemoveStay(stayId))
  } catch (err) {
    console.log("Cannot remove stay", err)
    throw err
  }
}

export async function addStay(stay) {
  try {
    const savedStay = await stayService.save(stay)
    store.dispatch(getCmdAddStay(savedStay))
    return savedStay
  } catch (err) {
    console.log("Cannot add stay", err)
    throw err
  }
}

export async function updateStay(stay) {
  try {
    const savedStay = await stayService.save(stay)
    store.dispatch(getCmdUpdateStay(savedStay))
    return savedStay
  } catch (err) {
    console.log("Cannot save stay", err)
    throw err
  }
}

export async function addStayMsg(stayId, txt) {
  try {
    const msg = await stayService.addStayMsg(stayId, txt)
    store.dispatch(getCmdAddStayMsg(msg))
    return msg
  } catch (err) {
    console.log("Cannot add stay msg", err)
    throw err
  }
}

// Command Creators:
function getCmdSetStays(stays) {
  return {
    type: SET_STAYS,
    stays,
  }
}
function getCmdSetStay(stay) {
  return {
    type: SET_STAY,
    stay,
  }
}
function getCmdSetPagination(pageIdx, totalPages) {
  return {
    type: SET_PAGINATION,
    pageIdx,
    totalPages
  }
}
function getCmdRemoveStay(stayId) {
  return {
    type: REMOVE_STAY,
    stayId,
  }
}
function getCmdAddStay(stay) {
  return {
    type: ADD_STAY,
    stay,
  }
}
function getCmdUpdateStay(stay) {
  return {
    type: UPDATE_STAY,
    stay,
  }
}
function getCmdAddStayMsg(msg) {
  return {
    type: ADD_STAY_MSG,
    msg,
  }
}

// unitTestActions()
async function unitTestActions() {
  await loadStays()
  await addStay(stayService.getEmptyStay())
  await updateStay({
    _id: "m1oC7",
    name: "Stay-Good",
  })
  await removeStay("m1oC7")
  // TODO unit test addStayMsg
}
