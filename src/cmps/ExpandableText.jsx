import { useToggle } from "../customHooks/useToggle"


export function ExpandableText({ text, limit = 100, className = '' }) {
  const [isExpanded, toggleIsExpanded] = useToggle(false)

  if (!text) return null

  const shouldTruncate = text.length > limit
  const displayText = isExpanded || !shouldTruncate
    ? text
    : text.substring(0, limit - 3) + '...'

  return (
    <p className={`expandable-text ${className}`}>
      {displayText}
      {shouldTruncate && (
        <button
          className="btn-toggle-text"
          onClick={toggleIsExpanded}
        >
          {isExpanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </p>
  )
}