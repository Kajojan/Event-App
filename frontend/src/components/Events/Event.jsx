import { Box, Typography } from "@mui/material";
import style from "./Event.module.scss";

const Event = ({ item, onClick }) => {
  return (
    <Box onClick={onClick} className={style.event_container}>
      <Box className={style.event_image}>
        <img
          src="https://cache.marriott.com/content/dam/marriott-renditions/dm-static-renditions/continents/us-canada/en_us/lifestyle/photo/2022-photoshoot/limited/assets/pdt-b2b-812667705994678-168370154999290-wide-hor.jpg?interpolation=progressive-bilinear&downsize=600px:*"
          alt="EventImage"
        />
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
