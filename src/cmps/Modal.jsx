import { XIcon } from "./Icons"


export function Modal({ children, onClose, className = '' }) {

  return (
    <div className={`modal modal-backdrop ${className}`} onClick={onClose}>
      <div
        className="modal-container"
        onClick={(ev) => ev.stopPropagation()}
      >
        <button className="btn-close-modal" onClick={onClose}><XIcon /></button>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  )
}