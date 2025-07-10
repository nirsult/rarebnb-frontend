export function Loader({ version = 'dark', className }) {
  const strokeColor = version === 'light' ? '#fff' : '#555'
  const opacity = version === 'light' ? '.5' : '.3'

  return (
    <div className={`loader ${className}`}>
      <svg width="38" height="38" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke={strokeColor}>
        <g fill="none" fillRule="evenodd">
          <g transform="translate(1 1)" strokeWidth="2">
            <circle strokeOpacity={opacity} cx="18" cy="18" r="18" />
            <path d="M36 18c0-9.94-8.06-18-18-18">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 18 18"
                to="360 18 18"
                dur="1s"
                repeatCount="indefinite"
              />
            </path>
          </g>
        </g>
      </svg>
    </div>
  )
}
