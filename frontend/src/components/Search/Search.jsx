import { useState } from 'react'
import styles from './Search.module.scss'
import { Box, Typography } from '@mui/material'
import EventList from '../Events/EventList'
import apiData from '../../services/apiData'
import Filters from './Filters'
const Search = () => {
  const [event, setEvent] = useState([])

  const handleChange = (event) => {
    if (event.target.value != '')
      apiData.getEventByName(event.target.value).then((res) => {
        setEvent(res.data)
        console.log(res.data)
      })
  }

  return (
    <Box>

      <Typography
        variant="h1"
        fontWeight="500"
        className={styles.Typography_home}
        sx={{
          fontSize: ['xx-large', 'xx-large', 'xxx-large', 'xxx-large'],
          paddingLeft: [0, 0, 3, 0],
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
      <Box className={styles.search_container}>
        <Filters setEvent={setEvent}/>
        <EventList events={event} name={''} ></EventList>
      </Box>
    </Box>
  )
}
export default Search
