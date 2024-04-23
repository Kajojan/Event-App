import { Box, Link, Typography } from "@mui/material";
import style from "./Event.module.scss";
import Event from "./Event";
import { CreateIcon, TimeIcon, PopularIcon, RecommendedIcon, MapIcon } from "../icons";
import { useNavigate } from "react-router-dom";

const EventMain = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Typography
        variant="h1"
        fontWeight="500"
        className={style.Typography_home}
        sx={{
          fontSize: ["xx-large", "xx-large", "xxx-large", "xxx-large"],
          paddingLeft: [0, 0, 3, 0],
        }}
      >
        Wydarzenia
      </Typography>
      <Box className={style.box_container}>
        <Box onClick={() => navigate("/event/create")}>
          <Link>Utwórz Nowe</Link>
          <CreateIcon></CreateIcon>
        </Box>
        <Box onClick={() => navigate("/event/yourcomming")}>
          <Link>Twoje nadchodzące</Link>
          <TimeIcon></TimeIcon>
        </Box>
        <Box onClick={() => navigate("/event/popular")}>
          <Link>popularne</Link>
          <PopularIcon></PopularIcon>
        </Box>
        <Box onClick={() => navigate("/event/recomended")}>
          <Link>rekomendowane</Link>
          <RecommendedIcon></RecommendedIcon>
        </Box>
        <Box onClick={() => navigate("/event/comming")}>
          <Link>comming</Link>
          <TimeIcon></TimeIcon>
        </Box>
        <Box onClick={() => navigate("/event/map")}>
          <Link>Map</Link>
          <MapIcon></MapIcon>
        </Box>
      </Box>
    </Box>
  );
};
export default EventMain;
