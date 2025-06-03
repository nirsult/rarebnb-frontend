export function Popover({ children, menuRef, style = { left: '50%', transform: 'translateX(-50%)' } }) {
  return (
    <div ref={menuRef} className="popover" style={style}>
      {children}
    </div>
  )
}