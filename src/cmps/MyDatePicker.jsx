import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";

export function MyDatePicker({ onSetDates, setActiveSection, markedDates = [] }) {
  const [startDate, endDate] = markedDates

  function handleChange(update) {
    const [start, end] = update
    onSetDates({ checkIn: start, checkOut: end })

    if (start && !end) setActiveSection('check-out')
  }

  return (
    <section className="date-picker">
      <DatePicker
        selected={startDate}
        onChange={handleChange}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        monthsShown={2}
        inline
        formatWeekDay={(nameOfDay) => nameOfDay.charAt(0)}
        minDate={new Date()}
      />
    </section>
  )
}