import { useState } from 'react'
import styles from './Search.module.scss'
import { Box, Button, Typography } from '@mui/material'
import EventList from '../Events/EventList'
import apiData from '../../services/apiData'
import Filters from './Filters'
const Search = () => {
  const [event, setEvent] = useState([])
  const [skip, setSkip] = useState(0)

  const handleChange = (event) => {
    if (event.target.value != '')
      apiData.getEventByName(event.target.value).then((res) => {
        setEvent([...event, ...res.data])
      })
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
          marginTop:'40px'
        }}
      >
        Wyszukaj
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box style={{ flex:1, padding:'20px' }}></Box>
        <Box sx={{ flex: 3 }}>
          <input className={styles.input} type="text" placeholder="Nazwa" onChange={handleChange} />
        </Box>
      </Box>

      <Box className={window.innerWidth > 1300 ? styles.search_container : styles.search_container_secound} >
        <Filters event={event} skip={skip} setEvent={setEvent}/>
        <EventList events={event} name={''} ></EventList>
      </Box>
      <Button onClick={async () => {
        setSkip(prevSkip => prevSkip + 5)
      }}>More</Button>
    </Box>
  )
}
export default Search
