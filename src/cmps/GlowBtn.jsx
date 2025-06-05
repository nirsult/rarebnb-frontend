import { useState } from "react"

export function GlowBtn({ text, onClick, type = "button" }) {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })

  function handleMouseMove(ev) {
    const rect = ev.currentTarget.getBoundingClientRect()
    const x = ((ev.clientX - rect.left) / rect.width) * 100
    const y = ((ev.clientY - rect.top) / rect.height) * 100
    setMousePosition({ x, y })
  }

  return (
    <button
      className="glow-btn"
      onMouseMove={handleMouseMove}
      type={type}
      style={{
        background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, #ff385c, #bd1e59)`
      }}
      onClick={onClick}
    >
      {text}
    </button>
  )
}
