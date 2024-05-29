import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, Button } from "@mui/material";
import Event from "./Event";
import styles from "./EventList.module.scss";
import { Link, useNavigate } from "react-router-dom";

const duplicateNull = (data) => {
  const seen = new Set();
  return data.map(item => {
    const key = `${item._fields[0]?.identity?.low}`;
    if (seen.has(key)) {
      return {
        ...item,
        _fields: [
          ...item._fields.slice(0, item._fieldLookup.n),
          null,
          ...item._fields.slice(item._fieldLookup.n + 1)
        ]
      };
    } else {
      seen.add(key);
      return item;
    }
  });
}
const EventList = ({ events, name }) => {


  const [sortedEvents, setSortedEvents] = useState(duplicateNull(events));
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortBy, setSortBy] = useState("name");
  const [layout, setLayout] = useState("list");
  const navigate = useNavigate();

  const handleSort_Date = (property) => {
    const isAsc = sortBy === property && sortOrder === "asc";
    const newOrder = isAsc ? "desc" : "asc";
    setSortOrder(newOrder);
    setSortBy(property);
    const sorted = [...sortedEvents].sort((a, b) => {
      const dateA = new Date(a._fields[0].properties["eventDate"]);
      const dateB = new Date(b._fields[0].properties["eventDate"]);

      if (dateA < dateB) {
        return newOrder === "asc" ? -1 : 1;
      }
      if (dateA > dateB) {
        return newOrder === "asc" ? 1 : -1;
      }
      const timeA = a._fields[0].properties["eventTime"]
      const timeB = b._fields[0].properties["eventTime"]
      if (timeA < timeB) {
        return newOrder === "asc" ? -1 : 1;
      }
      if (timeA > timeB) {
        return newOrder === "asc" ? 1 : -1;
      }
      return 0;
    });


    setSortedEvents(sorted);
  };

  const handleSort_Name = (property) => {
    const isAsc = sortBy === property && sortOrder === "asc";
    const newOrder = isAsc ? "desc" : "asc";
    setSortOrder(newOrder);
    setSortBy(property);

    const sorted = [...sortedEvents].sort((a, b) => {
      const nameA = a._fields[0].properties.eventName.toLowerCase();
      const nameB = b._fields[0].properties.eventName.toLowerCase();

      if (nameA < nameB) {
        return newOrder === "asc" ? -1 : 1;
      }
      if (nameA > nameB) {
        return newOrder === "asc" ? 1 : -1;
      }
    }
    )

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
  useEffect(() => {
    setSortedEvents(duplicateNull(events))
  }, [events])
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
        <Button variant="outlined" sx={{ borderColor: "#0000ff", color: "black", fontWeight: "normal" }} onClick={() => handleSort_Name("eventName")}>
          Sortuj po nazwie  ({sortOrder === "asc" && sortBy === "eventName" ? "asc" : "desc"})
        </Button>
        <Button variant="outlined" sx={{ borderColor: "#0000ff", color: "black", fontWeight: "normal" }} onClick={() => handleSort_Date("eventDate")} style={{ marginLeft: 8 }}>
          Sortuj po dacie ({sortOrder === "asc" && sortBy === "eventDate" ? "asc" : "desc"})
        </Button>
      </Box>
      <Box mb={2}>
        <Button variant="outlined" sx={{ borderColor: "#0000ff", color: "black", fontWeight: "normal" }} onClick={() => handleLayoutChange("list")}>
          List
        </Button>
        <Button variant="outlined" sx={{ borderColor: "#0000ff", color: "black", fontWeight: "normal" }} onClick={() => handleLayoutChange("2col")} style={{ marginLeft: 8 }}>
          2 kolumny
        </Button>
        <Button variant="outlined" sx={{ borderColor: "#0000ff", color: "black", fontWeight: "normal" }} onClick={() => handleLayoutChange("3col")} style={{ marginLeft: 8 }}>
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
                  handleClickEvent(item._fields[0].identity.low)
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
