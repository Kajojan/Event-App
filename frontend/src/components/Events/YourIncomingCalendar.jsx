
import Calendar from 'react-calendar'
import PropTypes from 'prop-types'
import './YourIncomingCalendar.scss'
import 'react-calendar/dist/Calendar.css'
import { useNavigate } from 'react-router-dom'

const eventsObject = (array) => {
  const eventsByDate = array.reduce((acc, event) => {

    const eventDate = event._fields[0].properties.eventDate

    if (!acc[eventDate]) {
      acc[eventDate] = []
    }

    acc[eventDate].push(event)

    return acc
  }, {})

  return Object.keys(eventsByDate)
    .sort((a, b) => new Date(a) - new Date(b))
    .reduce((acc, date) => {
      acc[date] = eventsByDate[date].sort((a, b) => {
        const timeA = a._fields[0].properties.eventTime
        const timeB = b._fields[0].properties.eventTime
        return timeA.localeCompare(timeB)
      })
      return acc
    }, {})
}



function formatDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}


export default function YourIncomingCalendar({ events }) {
  const navigate = useNavigate()
  const eventsData = eventsObject(events)

  const tileContent = ({ date, view }) => {
    const key = formatDateKey(date)
    if (view === 'month' && eventsData[key] && Array.isArray(eventsData[key])) {
      return (
        <div className="event-dot" style={{ width:'100%' }}>
          <ul style={{ listStyle:'none', padding: 0 }}>
            {eventsData[key].map((event, index) => (
              <li key={index} className='event_item_li' onClick={()=>{navigate(`/event/${event._fields[0].identity.low}`)}}>
                {event._fields[0].properties.eventTime} - {event._fields[0].properties.eventName}
              </li>
            ))}
          </ul>
        </div>
      )
    }
  }


  const tileClassName = ({ date, view }) => {
    const key = formatDateKey(date)

    let classNames = 'calendar-day'

    if (view === 'month' && eventsData[key] && Array.isArray(eventsData[key])) {
      classNames += ' event-day'
    }

    return classNames
  }


  return (
    <div>
      <Calendar
        className='calandar_main_container'
        locale="pl-PL"
        tileContent={tileContent}
        tileClassName={tileClassName}
        showNavigation={true}
      />
    </div>
  )
}

YourIncomingCalendar.propTypes = {
  events: PropTypes.objectOf(PropTypes.string).isRequired
}
