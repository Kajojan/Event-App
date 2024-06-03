import { Box, Typography } from "@mui/material";
import style from "./Event.module.scss";

const Event = ({ item, onClick, className = "" }) => {
  const source = item._fields[0] === null ? item._fields[2] : item._fields[0];
  const { address, eventDate, eventDescription, eventImage, eventName, eventTime } = source?.properties || {};
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
          <a>Date: {eventDate}, {eventTime} </a>
          <a>Miejsce: {address}</a>
        </Box>
      </Box>
    );
  }

};
export default Event;
