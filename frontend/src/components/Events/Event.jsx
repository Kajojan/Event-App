import { Box, Typography } from '@mui/material'
import style from './Event.module.scss'
import PropTypes from 'prop-types'

const Event = ({ item, onClick, className = '' }) => {
  const source = item._fields[0] === null ? item._fields[2] : item._fields[0]
  const { address, eventDate, eventImage, eventName, eventTime } = source?.properties || {}
  if (eventImage) {
    return (
      <Box onClick={onClick} className={`${style.event_container} ${className}`}>
        <Box className={style.event_image}>
          <img
            src={eventImage}
            alt="EventImage"
          />
        </Box>
        <Typography>{eventName}</Typography>
        <Box className={style.event_content}>
          Organizator: {item?._fields[1]?.properties?.nickname}
          <a>Data i godzina: {eventDate}, {eventTime} </a>
          <a>Miejsce: {address}</a>
        </Box>
      </Box>
    )
  }
  else {
    return (
      <Box onClick={onClick} className={`${style.event_container} ${className}`}>
        <Typography>Brak danych, spróbuj odświeżyć stronę</Typography>
      </Box>
    )
  }

}
Event.propTypes = {
  item: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string
}
export default Event
