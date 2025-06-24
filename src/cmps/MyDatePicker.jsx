import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"

export function MyDatePicker({ onSetDates, setActiveSection, markedDates = [], monthsShown = 2, className = '', isMobile = false }) {
  const [startDate, endDate] = markedDates

  function handleChange(update) {
    const [start, end] = update
    onSetDates({ checkIn: start, checkOut: end })

    if (!isMobile && start && !end && setActiveSection) setActiveSection('check-out')
  }

  return (
    <section className={`date-picker ${className}`}>
      <DatePicker
        selected={startDate}
        onChange={handleChange}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        monthsShown={monthsShown}
        inline
        formatWeekDay={(nameOfDay) => nameOfDay.charAt(0)}
        minDate={new Date()}
      />
    </section>
  )
}