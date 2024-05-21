import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, Button } from "@mui/material";
import Event from "./Event";
import styles from "./EventList.module.scss";
import { Link, useNavigate } from "react-router-dom";


const EventList = ({ events, name }) => {
  const [sortedEvents, setSortedEvents] = useState(events);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortBy, setSortBy] = useState("name");
  const [layout, setLayout] = useState("list"); 
  const navigate = useNavigate();

  const handleSort = (property) => {
    const isAsc = sortBy === property && sortOrder === "asc";
    const newOrder = isAsc ? "desc" : "asc";
    setSortOrder(newOrder);
    setSortBy(property);

    const sorted = [...events].sort((a, b) => {
      if (newOrder === "asc") {
        return a[property] < b[property] ? -1 : 1;
      } else {
        return a[property] > b[property] ? -1 : 1;
      }
    });


    setSortedEvents(sorted);
  };

  const handleLayoutChange = (newLayout) => {
    setLayout(newLayout);
  };

  const handleClickEvent = (id) => {
    navigate(`/event/${id}`);
  };

  const getGridItemProps = () => {
    switch (layout) {
      case "2col":
        return { xs: 12, sm: 6 };
      case "3col":
        return { xs: 12, sm: 4 };
      default:
        return { xs: 12 };
    }
  };
  useEffect(()=>{
    setSortedEvents(events)
  },[events])
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
        {name}
      </Typography>
      <Box mb={2} mt={10}>
        <Button variant="outlined"  sx={{borderColor: "#0000ff", color:"black", fontWeight: "normal" }} onClick={() => handleSort("name")}>
         Sortuj po nazwie  ({sortOrder === "asc" && sortBy === "name" ? "asc" : "desc"})
        </Button>
        <Button variant="outlined" sx={{borderColor: "#0000ff", color:"black", fontWeight: "normal" }} onClick={() => handleSort("date")} style={{ marginLeft: 8 }}>
        Sortuj po dacie ({sortOrder === "asc" && sortBy === "date" ? "asc" : "desc"})
        </Button>
      </Box>
      <Box mb={2}>
        <Button variant="outlined" sx={{borderColor: "#0000ff", color:"black", fontWeight: "normal" }} onClick={() => handleLayoutChange("list")}>
          List
        </Button>
        <Button variant="outlined" sx={{borderColor: "#0000ff", color:"black", fontWeight: "normal" }} onClick={() => handleLayoutChange("2col")} style={{ marginLeft: 8 }}>
          2 kolumny
        </Button>
        <Button variant="outlined" sx={{borderColor: "#0000ff", color:"black", fontWeight: "normal" }} onClick={() => handleLayoutChange("3col")} style={{ marginLeft: 8 }}>
          3 kolumny
        </Button>
      </Box>
      <Grid container className={styles.eventList_container}>
        {sortedEvents.map((item, index) => (
          <Grid
            item
            key={index}
            container
            {...getGridItemProps()}
            justifyContent={"center"}
            gap={"50px"}
            style={{ height: layout === "list" ? "500px" : "" }}
          >
            <div style={{ height: "fit-content", margin: "50px" }}>
              <Event
                onClick={() => {
                  handleClickEvent(item.id)
                }}
                item={item}
              />
            </div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default EventList;
