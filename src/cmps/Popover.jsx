export function Popover({ children, reference, style = { left: '50%', transform: 'translateX(-50%)' } }) {
  return (
    <div ref={reference} className="popover" style={style}>
      {children}
    </div>
  )
}