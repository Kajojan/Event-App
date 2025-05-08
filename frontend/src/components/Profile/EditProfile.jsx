import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Typography, Box, Grid, Button } from '@mui/material'
import apiData from '../../services/apiData'
import styles from './EditProfile.module.scss'
import { useNavigate } from 'react-router-dom'

const EditProfile = () => {
  const [seeStats, setSeeStats] = useState(false)
  const [stats, setStats] = useState([])
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0()
  const navigate = useNavigate()
  const [data, setData] = useState({})
  const [userData,] = useState(user)

  const getStats = () => {
    setStats([{ name: 'Wziałeś udział', value: 10 }, { name: 'Byłeś zainteresowany', value: 1 }, { name: 'nie poszedłeś', value: 4 }])
    setSeeStats(!seeStats)
  }
  useEffect(() => {
    apiData.getOnlyPersonData(user.email).then((res)=>{
      setData(res.data.user[0]._fields[0].properties)
    }).catch((err)=>{
      // eslint-disable-next-line no-console
      console.log(err)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!isAuthenticated) {
    loginWithRedirect()
  }
  const changeHandle = (event)=>{
    setData(prevData => ({
      ...prevData,
      [event.target.id]: event.target.value
    }))
  }

  return (
    <Box>
      <Typography
        variant="h1"
        fontWeight="600"
        className={styles.Typography_home}
        sx={{
          fontFamily: '"Noto Sans", sans-serif',
          fontSize: ['xx-large', 'xx-large', 'xxx-large', 'xxx-large'],
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
          <Box className={styles.name}>
            <label htmlFor="eventName" >Imie</label>
            <input type="text" id="eventName" value={data.name} onChange={changeHandle} />
          </Box>

          <Box className={styles.inputSmall}>
            <label>Nickname</label>
            <input id="nickname" value={data.nickname} onChange={changeHandle}/>
          </Box>

          <label>email</label>
          <a>{userData.email}</a>


          <Button onClick={() =>apiData.changeUser(user.email, data).then((_res)=>{
            navigate('/profile')
          })}> Zapisz</Button>
        </Box>

      </Grid>

      <Box sx={{ marginBlock: '20px', display:'flex', flexDirection:'column', alignContent:'center' }} >
        <Button onClick={() => getStats()}> Zobacz Statystyki </Button>
        {seeStats && stats.map((el, index) => {
          return (<Box key={index}>{el.name} : {el.value} </Box>)
        })}
        <Button onClick={() =>navigate('/profile') }> Wróć</Button>
        <Button onClick={() => logout()}> LOGOUt</Button>
      </Box>

    </Box>
  )
}

export default EditProfile
