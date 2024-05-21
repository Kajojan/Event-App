import { useState } from "react";
import styles from "./Search.module.scss";
import { Box,Typography } from "@mui/material";
import EventList from "../Events/EventList";
const Search = () => {
  const [event, setEvent] = useState([])

const handleChange=(event)=>{
  console.log(event.target.value);
}

return (
  <Box>
     <Typography
        variant="h1"
        fontWeight="500"
        className={styles.Typography_home}
        sx={{
          fontSize: ["xx-large", "xx-large", "xxx-large", "xxx-large"],
          paddingLeft: [0, 0, 3, 0],
        }}
      >
        Wyszukaj
      </Typography>
      <input className={styles.input} type="text" placeholder="Nazwa" onChange={handleChange} style={{margin:"20px"}} />
      <EventList events={event} name={""} ></EventList>
    </Box>
);
};
export default Search;
