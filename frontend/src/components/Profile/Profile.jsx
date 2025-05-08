import { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Typography, Box, Grid, Button, Rating } from '@mui/material'
import styles from './Profile.module.scss'
import apiData from '../../services/apiData'
import { useNavigate } from 'react-router-dom'
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@mui/material'

const Home = () => {
  const [seeStats, setSeeStats] = useState(false)
  const [stats, setStats] = useState([])
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0()
  const navigate = useNavigate()
  const [userData, setUserData] = useState(user)
  const [star, setStars] = useState({})

  const getStats = () => {
    apiData.getStatsUser(user.email).then((res) => {
      setStats([{ name: 'Wziałeś udział w wydarzeniach', value: res.data.values[1].low }, { name: 'Stworzyłeś wydarzeń', value: res.data.values[0].low }])
      setSeeStats(!seeStats)
      setStars({ avg: res.data.avg, number: res.data.number })
    })
  }
  useEffect(() => {
    apiData.getOnlyPersonData(user.email).then((res) => {
      setUserData(res.data.user.properties)
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  if (!isAuthenticated) {
    loginWithRedirect()
  }
  const statsArray = [
    ...stats.map((el) => ({
      label: el.name,
      value: `${el.value}`,
    })),
    ...(star.avg && star.number
      ? [
        {
          label: 'Średnia Ocena Twoich Wydarzeń',
          value: (
            <Rating
              name="read-only-rating"
              value={star.avg}
              readOnly
            />
          ),
        },
        {
          label: 'Ilość osób oceniających',
          value: star.number,
        },
      ]
      : []),
  ]


  return (
    <Box data-testid="profile-1">
      <Typography
        variant="h1"
        fontWeight="600"
        className={styles.Typography_home}
        sx={{
          fontFamily: '"Noto Sans", sans-serif',
          fontSize: ['xx-large', 'xx-large', 'xxx-large', 'xxx-large'],
          paddingLeft: [0, 0, 3, 0],
          marginTop:'40px'
        }}
      >
        Profil
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
              fontSize: ['xx-large', 'xx-large', 'xxx-large', 'xxx-large'],
              paddingLeft: [0, 0, 3, 0],
            }}
          >
            {userData.name || 'name'}
          </Typography>
          <label>Nickname</label>
          <a>  {userData.nickname || 'nickname'}</a>
          <label>email</label>
          <a>{userData.email || 'email'}</a>

        </Box>
      </Grid>

      <Box sx={{ marginBlock: '20px', display: 'flex', flexDirection: 'column', alignContent: 'center' }} >
        <Button onClick={() => getStats()}> Zobacz Statystyki </Button>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="statistics table">
            <TableBody>
              {seeStats && statsArray.map((item, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{item.label}</TableCell>
                  <TableCell align="center">{item.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button onClick={() => navigate('/edit-profile')}> Edycja</Button>
        <Button onClick={() => logout()}> Wyloguj</Button>
      </Box>
    </Box>
  )
}

export default Home
