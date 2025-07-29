import { useEffect, useRef, useState } from "react"
import { useToggle } from "../customHooks/useToggle"
import { XIcon } from "./Icons"
import { GlowBtn } from "./GlowBtn"
import { userService } from "../services/user"
import { login, signup } from "../store/actions/user.actions"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service"
import { useSelector } from "react-redux"
import { motion } from 'framer-motion'


export function LoginSignup({ onClose, loginModalRef }) {
  const [isSignup, toggleIsSignup] = useToggle(false)
  const [credentials, setCredentials] = useState(userService.getEmptyCredentials())
  const usernameRef = useRef()
  const passwordRef = useRef()
  const fullnameRef = useRef()

  const loggedInUser = useSelector((storeState) => storeState.userModule.loggedInUser)
  const demoGuestCredentials = { username: 'ben', password: 'ben' }
  const demoHostCredentials = { username: 'olivia', password: 'olivia' }

  useEffect(() => {
    document.body.classList.add('modal-open')

    return () => {
      document.body.classList.remove('modal-open')
    }
  }, [])

  function handleClick(ref) {
    ref?.current?.focus()
  }

  function handleChange({ target }) {
    const { name: field, value } = target
    setCredentials(prevCredentials => ({ ...prevCredentials, [field]: value }))
  }

  async function handleSubmit(ev) {
    ev.preventDefault()

    try {
      const action = isSignup ? signup : login
      await action(credentials)
      showSuccessMsg('Logged in successfully')
      onClose()
    } catch (err) {
      showErrorMsg('Wrong username or password')
    }
  }

  async function handleDemoLogin(ev, demoType) {
    ev.preventDefault()
    toggleIsSignup(false)

    const demoCreds = demoType === 'guest' ? demoGuestCredentials : demoHostCredentials

    try {
      await login(demoCreds)
      showSuccessMsg('Logged in successfully')
      onClose()
    } catch (err) {
      showErrorMsg('Error! Could not login')
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 200 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -200 }}
        transition={{ duration: 0.2, ease: "easeOut" }}>
        <section className="login-signup" ref={loginModalRef}>
          <header>
            <button className="btn-close btn-reset" onClick={onClose}><XIcon /></button>
            <h2>Log in or sign up</h2>
          </header>

          <div className="modal-body">
            <h3>Welcome to Rarebnb</h3>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                id="username"
                placeholder="Username"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                ref={usernameRef}
                onClick={() => handleClick(usernameRef)}
              />

              <input
                type="password"
                id="password"
                placeholder="Password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                ref={passwordRef}
                onClick={() => handleClick(passwordRef)}
              />

              {isSignup &&
                <input
                  type="text"
                  id="fullname"
                  placeholder="Full name"
                  name="fullname"
                  value={credentials.fullname}
                  onChange={handleChange}
                  ref={fullnameRef}
                  onClick={() => handleClick(fullnameRef)}
                />
              }
              <GlowBtn text={isSignup ? 'Signup' : 'Login'} type="submit" />
            </form>

            {!loggedInUser &&
              <section className="demo-login">
                <button className="btn-reset demo-guest" onClick={(ev) => handleDemoLogin(ev, 'guest')}>Demo login as guest</button>
                <button className="btn-reset demo-host" onClick={(ev) => handleDemoLogin(ev, 'host')}>Demo login as host</button>
              </section>}

            <p>
              {isSignup ? 'Already' : 'Don\'t'} have an account?
              <button className="btn-toggle-signup btn-reset" onClick={toggleIsSignup}>{isSignup ? 'Login' : 'Signup'}</button>
            </p>
          </div >
        </section >
      </motion.div>
      <div className="login-backdrop" onClick={onClose}></div>
    </>
  )
}