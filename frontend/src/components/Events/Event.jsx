import { Box, Typography } from "@mui/material";
import style from "./Event.module.scss";

const Event = ({ item, onClick }) => {
  return (
    <Box onClick={onClick} className={style.event_container}>
      <Box className={style.event_image}>
        <img src={item.title} alt="EventImage" />
      </Box>
      <Typography>Tytył</Typography>
      <Box className={style.event_content}>
        Organizator
        <a>Date</a>
        <a>Miejsce</a>
      </Box>
    </Box>
  );
};
export default Event;
