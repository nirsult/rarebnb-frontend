import { storageService } from "../async-storage.service"
import { httpService } from "../http.service"

const STORAGE_KEY_LOGGEDIN_USER = "loggedInUser"

export const userService = {
  login,
  logout,
  signup,
  getUsers,
  getById,
  remove,
  update,
  getLoggedInUser,
  saveLoggedInUser,
  getFakeLoggedInUser,
}

const demoUsers = [
  {
    _id: "682849d7ee9a48be9482edfd",
    fullname: "Admin",
    username: "admin",
    password: "admin",
    imgUrl:
      "https://res.cloudinary.com/dbbj46yzt/image/upload/v1747243843/main-qimg-65d7b5bb6dc440d68b478d5d45bfe756-lq_mphjbk.jpg",
    isAdmin: true,
  },
  {
    _id: "6828adcccc805aefb7c23ca6",
    fullname: "Mirit Ben Yehuda",
    username: "aa",
    password: "aa",
    imgUrl: "https://i.pravatar.cc/150?u=user",
    isAdmin: false,
  },
]

if (!localStorage.getItem("users")) {
  localStorage.setItem("users", JSON.stringify(demoUsers))
}

// async function getUsers() {
//   const users = await storageService.query('user')
//   return users.map(user => {
//     delete user.password
//     return user
//   })
// }
function getUsers() {
  const users = JSON.parse(localStorage.getItem("users")) || []
  return Promise.resolve(users)
}

async function getById(userId) {
  return await storageService.get("user", userId)
}

function remove(userId) {
  return storageService.remove("user", userId)
}

async function update({ _id, score }) {
  const user = await storageService.get("user", _id)
  user.score = score
  await storageService.put("user", user)

  // When admin updates other user's details, do not update loggedInUser
  const loggedInUser = getLoggedInUser()
  if (loggedInUser._id === user._id) saveLoggedInUser(user)

  return user
}

// async function login(userCred) {
//   const users = await storageService.query('user')
//   const user = users.find(user => user.username === userCred.username)

//   if (user) return saveLoggedInUser(user)
// }
function login({ username, password }) {
  const users = JSON.parse(localStorage.getItem("users")) || []
  const user = users.find(
    (user) => user.username === username && user.password === password
  )
  if (!user) return Promise.reject("Invalid credentials")

  localStorage.setItem("loggedInUser", JSON.stringify(user))
  return Promise.resolve(user)
}

async function signup(userCred) {
  if (!userCred.imgUrl)
    userCred.imgUrl =
      "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png"
  userCred.score = 10000

  const user = await storageService.post("user", userCred)
  return saveLoggedInUser(user)
}

// async function logout() {
//   sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
// }
function logout() {
  localStorage.removeItem("loggedInUser")
}

// function getLoggedInUser() {
//   return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
// }
function getLoggedInUser() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"))
  return user || null
}


// function saveLoggedInUser(user) {
//   user = {
//     _id: user._id,
//     fullname: user.fullname,
//     imgUrl: user.imgUrl,
//     score: user.score,
//     isAdmin: user.isAdmin,
//   }
//   sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
//   return user
// }
function saveLoggedInUser(user) {
  user = {
    _id: user._id,
    fullname: user.fullname,
    imgUrl: user.imgUrl,
    score: user.score,
    isAdmin: user.isAdmin,
  }

  localStorage.setItem("loggedInUser", JSON.stringify(user))
  return user
}

// To quickly create an admin user, uncomment the next line
// _createAdmin()
async function _createAdmin() {
  const user = {
    username: "admin",
    password: "admin",
    fullname: "Mustafa Adminsky",
    imgUrl:
      "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png",
    score: 10000,
  }

  const newUser = await storageService.post("user", userCred)
  console.log("newUser: ", newUser)
}

function getFakeLoggedInUser() {
  return {
    _id: "u101",
    fullname: "User 1",
    imgUrl:
      "https://res.cloudinary.com/dbbj46yzt/image/upload/v1747243843/main-qimg-65d7b5bb6dc440d68b478d5d45bfe756-lq_mphjbk.jpg",
    username: "user1",
    password: "secret",
    reviews: [
      {
        id: "madeId",
        txt: "Quiet guest...",
        rate: 4,
        by: {
          _id: "u102",
          fullname: "user2",
          imgUrl: "/img/img2.jpg",
        },
      },
    ],
  }
}
