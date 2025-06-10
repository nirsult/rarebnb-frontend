import { useState } from "react"
import { MinusIcon, PlusIcon } from "./Icons"


export function GuestPicker({ guests, onSetGuests, className = '' }) {

  function updateCount(type, diff) {
    const updatedGuests = {
      ...guests,
      [type]: Math.max(0, guests[type] + diff)
    }
    onSetGuests(updatedGuests)
  }

  return (
    <section className={`guest-picker ${className}`}>
      {[
        { key: 'adults', label: 'Adults', desc: 'Ages 13 or above' },
        { key: 'children', label: 'Children', desc: 'Ages 2 - 12' },
        { key: 'infants', label: 'Infants', desc: 'Under 2' },
        { key: 'pets', label: 'Pets', desc: 'Bringing a service animal?' }
      ].map(({ key, label, desc }) => (
        <section className={`${key} guest-row`} key={key}>

          <div className="guest-info">
            <p className="guest-type">{label}</p>
            <p className="guest-desc">{desc}</p>
          </div>

          <div className="guest-counter">
            <button type="button" onClick={() => updateCount(key, -1)} disabled={guests[key] === 0}><MinusIcon /></button>
            <span className="guest-count">{guests[key]}</span>
            <button type="button" onClick={() => updateCount(key, +1)}><PlusIcon /></button>
          </div>

        </section>
      ))}

    </section>
  )
}