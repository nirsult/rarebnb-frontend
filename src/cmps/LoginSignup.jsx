import { useEffect, useRef } from "react"
import { useToggle } from "../customHooks/useToggle"
import { XIcon } from "./Icons"
import { GlowBtn } from "./GlowBtn"


export function LoginSignup({ onClose, loginModalRef }) {
  const [isSignup, toggleIsSignup] = useToggle(false)
  const usernameRef = useRef()
  const passwordRef = useRef()
  const fullnameRef = useRef()

  useEffect(() => {
    document.body.classList.add('modal-open')

    return () => {
      document.body.classList.remove('modal-open')
    }
  }, [])

  function handleClick(ref) {
    ref?.current?.focus()
  }


  return (
    <>
      <section className="login-signup" ref={loginModalRef}>
        <header>
          <button className="btn-close btn-reset" onClick={onClose}><XIcon /></button>
          <h2>Log in or sign up</h2>
        </header>

        <div className="modal-body">
          <h3>Welcome to Rarebnb</h3>

          <form>
            <input
              type="text"
              id="username"
              placeholder="Username"
              ref={usernameRef}
              onClick={() => handleClick(usernameRef)}
            />

            <input
              type="password"
              id="password"
              placeholder="Password"
              ref={passwordRef}
              onClick={() => handleClick(passwordRef)}
            />

            {isSignup &&
              <input
                type="text"
                id="fullname"
                placeholder="Full name"
                ref={fullnameRef}
                onClick={() => handleClick(fullnameRef)}
              />
            }
          </form>

          <GlowBtn text={isSignup ? 'Signup' : 'Login'} />

          <p>
            {isSignup ? 'Already' : 'Don\'t'} have an account?
            <button className="btn-toggle-signup btn-reset" onClick={toggleIsSignup}>{isSignup ? 'Login' : 'Signup'}</button>
          </p>
        </div>
      </section>
      <div className="login-backdrop" onClick={onClose}></div>
    </>
  )
}