import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Typography, Box, Grid, Button } from "@mui/material";
import styles from "./Profile.module.scss"
import apiData from "../../services/apiData";

const Home = () => {
  const [seeStats, setSeeStats] = useState(false)
  const [stats, setStats] = useState([])
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();

  const getStats = () => {
    console.log(user);
    setStats([{ name: "Wziałeś udział", value: 10 }, { name: "Byłeś zainteresowany", value: 1 }, { name: "nie poszedłeś", value: 4 }])
    setSeeStats(!seeStats)
  }
  useEffect(() => {
    apiData.getOnlyPersonData("user2").then((res) => { console.log(res); })
    // apiData.register(user)
  }, [])

  console.log(isAuthenticated);

  if (!isAuthenticated) {
    loginWithRedirect()
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
        Profile
      </Typography>

      <Grid container className={styles.profile_container}>

        <Box className={styles.user_image}>
          <img
            src={user.picture}
            alt="userImage"
          />
        </Box>
        <Box className={styles.profile_box}>
          <Typography
            variant="h1"
            fontWeight="500"
            className={styles.Typography_home}
            sx={{
              fontSize: ["xx-large", "xx-large", "xxx-large", "xxx-large"],
              paddingLeft: [0, 0, 3, 0],
            }}
          >
            {user.name}
          </Typography>
          <label>Nickname</label>
          <a>  {user.nickname}</a>
          <label>email</label>
          <a>{user.email}</a>

        </Box>
      </Grid>
      <Box>
        <Button variant="outlined" onClick={() => getStats()}> Zobacz Statystyki </Button>
        {seeStats && stats.map((el) => {
          return (<Box>{el.name} : {el.value} </Box>)
        })}
      </Box>
      <Button onClick={() => logout()}> LOGOUt</Button>
    </Box>
  );
};

export default Home;
