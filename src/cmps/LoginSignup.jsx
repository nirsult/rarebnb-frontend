import { useEffect, useRef } from "react"


export function LoginSignup({ onClose, loginModalRef }) {
  const inputRef = useRef()

  function handleClick() {
    console.log('IN FUNCTION')
    inputRef.current?.focus()
  }


  return (
    <section className="login-signup">
      <div className="login-backdrop" onClick={onClose}></div>
      <div className="modal-content" ref={loginModalRef}>

        <h2>Log in or sign up</h2>
        <h3>Welcome to Rarebnb</h3>
        <button onClick={onClose}>x</button>

        <form>
          <label htmlFor="username"></label>
          <input type="username" id="username" ref={inputRef} placeholder="Username" onClick={() => { console.log('Input Clicked'); inputRef.current?.focus() }} onFocus={() => console.log('Username focused')}
            onBlur={() => console.log('Username blurred')} />

          <label htmlFor="password"></label>
          <input type="password" id="password" placeholder="Password" />
        </form>
      </div>

    </section>
  )
}