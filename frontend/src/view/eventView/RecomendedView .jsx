import { useEffect, useState } from 'react'
import Header from '../../components/Header/Header'
import EventList from '../../components/Events/EventList'
import { useDispatch, useSelector } from 'react-redux'
import { getEvents } from '../../store/slices/socketSlice'
import { useAuth0 } from '@auth0/auth0-react'
import { Button } from '@mui/material'


const RecomendedView = () => {
  const { user } = useAuth0()
  const dispatch = useDispatch()
  const [events, setEvents] = useState([])
  const socket = useSelector((state) => state.socket.socket)
  const [skip, setSkip] = useState(0)

  const connectAndCollect = (valueSkip) => {
    socket.on('receive_new_event_reco', (data) => {
      setEvents(prevEvents => [...prevEvents, ...data])
      socket.off('receive_new_event_reco')
    })
    dispatch(getEvents({ name: 'recommended', skip: valueSkip, username: user.email }))

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
      <EventList
        events={events}
        name={'Rekomendowane wydarzenia'}
      ></EventList>
      <Button onClick={async () => {
        setSkip(prevSkip => prevSkip + 5)
        connectAndCollect(skip + 5)
      }}>More</Button>

    </div>
  )
}

export default RecomendedView
