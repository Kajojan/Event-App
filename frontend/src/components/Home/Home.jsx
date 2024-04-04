import React, { useEffect, useState } from "react";
import { Box, Typography, Divider } from "@mui/material";
import Event from "../Events/Event";
import style from "./Home.module.scss";

const Home = () => {
  const [data, setData] = useState([
    {
      username: "kajo",
      content:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
    },
    {
      username: "kajo",
      content:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
    },
    {
      username: "kajo",
      content:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
    },
    {
      username: "kajo",
      content:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
    },
  ]);

  useEffect(() => {
    // data from Api
  });
  const handleClickEvent = () => {
    console.log("Cclick");
  };

  return (
    <Box>
      <Typography
        variant="h1"
        fontWeight="500"
        // color={homePageTheme.background.color}
        // className={styles.header}
        sx={{
          fontSize: ["xx-large", "xx-large", "xxx-large", "xxx-large"],
          paddingLeft: [0, 0, 3, 0],
        }}
      >
        Aplikacja
      </Typography>
      <a> About </a>

      <Divider
        sx={{
          "&::before, &::after": {
            borderColor: "#0000ff",
          },
        }}
        style={{ width: "60%", marginTop: "20px", margin: "0 auto", fontSize: "20px" }}
        textAlign="left"
      >
        Popularne Eventy{" "}
      </Divider>
      <Box className={style.home_container}>
        {data.map((item, index) => {
          return <Event onClick={handleClickEvent} item={item}></Event>;
        })}
      </Box>
      <Divider
        sx={{
          "&::before, &::after": {
            borderColor: "#0000ff",
          },
        }}
        style={{ width: "60%", marginTop: "20px", margin: "0 auto", fontSize: "20px" }}
        textAlign="left"
      >
        Najbliższe/nadchodzące
      </Divider>
      <Box className={style.home_container}>
        {data.map((item, index) => {
          return <Event onClick={handleClickEvent} item={item}></Event>;
        })}
      </Box>
    </Box>
  );
};

export default Home;
