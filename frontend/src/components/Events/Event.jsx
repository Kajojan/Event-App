/* eslint-disable react/prop-types */
import { Box, Rating, Typography } from '@mui/material'
import style from './Event.module.scss'
// import PropTypes from 'prop-types'

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
          <a className={style.EventDate}> {eventDate} {eventTime}  </a>
        </Box>
        <Typography>{eventName}</Typography>
        <Box className={style.event_content}>
          <label> Organizator: </label>
          <a>{item?._fields[1]?.properties?.nickname} </a>
          <Box className={style.rating_box}>
            <Rating
              sx={{
                fontSize: '18px'
              }}
              name="read-only-rating"
              precision={0.01}
              value={item?._fields[3]}
              readOnly
            />
            <span style={{ margin:0, fontSize: '16px', color: '#c0c0c0' }}>/ {item?._fields[4]?.low}</span>
          </Box>
          <label>Miejsce: </label>
          <a>{address}</a>
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

export default Event
