import { useEffect, useState } from 'react'
import { Box, Typography, Divider } from '@mui/material'
import Event from '../Events/Event'
import style from './Home.module.scss'
import { Link, useNavigate } from 'react-router-dom'
import apiData from '../../services/apiData'
import NoDataBox from '../helper/Error'

const Home = () => {
  const navigate = useNavigate()
  const [popularData, setPopularData] = useState([])
  const [incomingData, setIncomingData] = useState([])


  useEffect(() => {
    apiData.getEvents('email', 'popular').then((res) => {
      setPopularData(res.data.slice(0, 4))
    })
    apiData.getEvents('email', 'incomming').then((res) => {
      setIncomingData(res.data.slice(0, 4))
    })
  }, [])

  const handleClickEvent = (id) => {
    navigate(`event/${id}`)
  }

  return (
    <Box>
      <Typography
        variant="h1"
        fontWeight="600"
        className={style.Typography_home}
        sx={{
          fontFamily: '"Noto Sans", sans-serif',
          fontSize: ['xx-large', 'xx-large', 'xxx-large', 'xxx-large'],
          paddingLeft: [0, 0, 3, 0],
          marginTop:'30px'
        }}
      >
        EventApp
      </Typography>
      <a > Aplikacja stworzona do znajdowaniu interesujących wydarzeń oraz brania w nich udziału.</a>
      <br></br>
      <a style={{ marginBottom:'30px' }}>Także zapraszam do tworzenia własnych wydarzeń i zapraszaniu ludzi.</a>

      <Divider
        sx={{
          '&::before, &::after': {
            borderColor: '#0000ff',
          },
        }}
        style={{ width: '60%', marginTop: '50px', margin: '0 auto', fontSize: '20px' }}
        textAlign="left"
      >
        <Link className={style.home_link} to="/event/popular">
          Popularne wydarzenia
        </Link>
      </Divider>
      <Box className={style.home_container}>
        {Array.isArray(popularData) && popularData.length > 0 ? (popularData.map((item, index) => {
          return (
            <Event
              key={index}
              onClick={() => {
                handleClickEvent(item._fields[0].identity.low)
              }}
              item={item}
              className={style.event_home}
            ></Event>
          )
        })) : (
          <NoDataBox/>
        )}
      </Box>
      <Divider
        sx={{
          '&::before, &::after': {
            borderColor: '#0000ff',
          },
        }}
        style={{ width: '60%', marginTop: '20px', margin: '0 auto', fontSize: '20px' }}
        textAlign="left"
      >
        <Link className={style.home_link} to="/event/comming">
          Nadchodzące wydarzenia
        </Link>
      </Divider>
      <Box className={style.home_container}>
        {Array.isArray(incomingData) && incomingData.length > 0 ?
          (incomingData.map((item, index) => {
            return (
              <Event
                key={index}
                onClick={() => {
                  handleClickEvent(item._fields[0].identity.low)
                }}
                item={item}
                className={style.event_home}

              ></Event>
            )
          })) : (
            <NoDataBox/>
          )}
      </Box>
    </Box>
  )
}

export default Home
