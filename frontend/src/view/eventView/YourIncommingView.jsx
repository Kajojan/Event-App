import { useEffect, useState } from 'react'
import Header from '../../components/Header/Header'
import EventList from '../../components/Events/EventList'
import { useDispatch, useSelector } from 'react-redux'
import { getEvents } from '../../store/slices/socketSlice'
import { useAuth0 } from '@auth0/auth0-react'
import { Box, Button, Typography } from '@mui/material'
// eslint-disable-next-line no-unused-vars
import YourIncomingCalendar from '../../components/Events/YourIncomingCalendar'


const YourIncommingView = () => {
  const { user } = useAuth0()
  const dispatch = useDispatch()
  const [events, setEvents] = useState([])
  const socket = useSelector((state) => state.socket.socket)
  const [skip, setSkip] = useState(0)
  const [open, setOpen] = useState(true)

  const connectAndCollect = (valueSkip) => {
    socket.on('receive_new_event_yourComing', (data) => {
      setEvents(prevEvents => {
        const newEvents = [...prevEvents, ...data]
        const seen = new Set()
        const uniqueEvents = newEvents.filter(event => {
          const id = event._fields[0].identity.low
          if (seen.has(id)) {
            return false
          } else {
            seen.add(id)
            return true
          }
        })
        return uniqueEvents
      })
      console.log(data)

      socket.off('receive_new_event_yourComing')

    })

    dispatch(getEvents({ name: 'yourincomming', skip: valueSkip, username: user.email, type:'PART' }))

  }

  useEffect(() => {
    if (socket) {
      connectAndCollect(skip)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket])


  return (
    <div>
      <Header></Header>
      <Typography
        variant="h1"
        fontWeight="500"
        sx={{
          fontSize: ['xx-large', 'xx-large', 'xxx-large', 'xxx-large'],
          paddingLeft: [0, 0, 3, 0],
          marginTop:'40px',
          margin: '20px'
        }}
      >
      Twoje nadchodzące wydarzenia
      </Typography>
      <Box sx={{
        marginTop:'20px',
        display:'flex',
        gap:'20px',
        justifyContent:'center'
      }}>
        <Button style={{ border: open ? 'unset' : '1px solid blue' }} onClick={()=>setOpen(false)}>Lista</Button>
        <Button style={{ border: !open ? 'unset' : '1px solid blue' }} onClick={()=>setOpen(true)} >Kalendarz</Button>
      </Box>
      { !open && <>
        <EventList
          events={events}
          name={' '}
        ></EventList>
        <Button onClick={async () => {
          setSkip(prevSkip => prevSkip + 5)
          connectAndCollect(skip + 5)
        }}>More</Button>
      </>
      }
      {open && <YourIncomingCalendar events={events}/>}



    </div>
  )
}

export default YourIncommingView
