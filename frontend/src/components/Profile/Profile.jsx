import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Typography, Box, Grid, Button } from "@mui/material";
import styles from "./Profile.module.scss"
import apiData from "../../services/apiData";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [seeStats, setSeeStats] = useState(false)
  const [stats, setStats] = useState([])
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const navigate = useNavigate()
  const [userData, setUserData]=useState(user)


  const getStats = () => {
    apiData.getStatsUser(user.email).then((res)=>{
      console.log(res.data.values);
      setStats([{ name: "Wziałeś udział w ",value: res.data.values[1].low }, { name: "Stworzyłeś", value: res.data.values[0].low }])
      setSeeStats(!seeStats)
    })
  }
  useEffect(() => {
    apiData.getOnlyPersonData(user.email).then((res)=>{
      setUserData(res.data.user[0]._fields[0].properties)
    }).catch((err)=>{
      console.log(err);
    })
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
            {userData.name}
          </Typography>
          <label>Nickname</label>
          <a>  {userData.nickname}</a>
          <label>email</label>
          <a>{userData.email}</a>

        </Box>
      </Grid>

      <Box sx={{ marginBlock: "20px",  display:"flex", flexDirection:"column", alignContent:"center" }} >
        <Button  onClick={() => getStats()}> Zobacz Statystyki </Button>
        {seeStats && stats.map((el) => {
          return (<Box sx={{margin: "10px"}}>{el.name}  {el.value} wydarzeniach</Box>)
        })}
      <Button onClick={() =>navigate("/edit-profile") }> Edycja</Button>
      <Button onClick={() => logout()}> LOGOUt</Button>
      </Box>
    </Box>
  );
};

export default Home;
