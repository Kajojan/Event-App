import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DelRevie, IntNotification } from '../../store/slices/socketSlice'
import { Box, Grid, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import styles from './Notification.module.scss'
import RatingPopup from './Review'
import apiData from '../../services/apiData'
import { useAuth0 } from '@auth0/auth0-react'

const Notifications = () => {
  const dispatch = useDispatch()
  const notifications = useSelector(state => state.socket.notification)
  const revies = useSelector(state => state.socket.revie)
  const [open, setOpen] = useState(false)
  const [element, setElement] = useState({})
  const { user } = useAuth0()

  const onSubmit = (review)=>{
    apiData.addReview(
      { 'email':user.email,
        'eventId':element.identity.low,
        'star': review.stars,
        'content': review.content })
      .then((res)=>{
        if (res.data.isSuccessful) {
          dispatch(DelRevie(element))
        }
      })

  }
  const isOpen = (el)=>{
    setOpen(true)
    setElement(el)
  }
  const close = ()=>{
    setOpen(false)
    setElement({})
  }
  useEffect(() => {
    dispatch(IntNotification(0))
  })

  return <Box >
    <Typography
      variant="h1"
      fontWeight="500"
      className={styles.Typography_home}
      sx={{
        fontSize: ['xx-large', 'xx-large', 'xxx-large', 'xxx-large'],
        paddingLeft: [0, 0, 3, 0],
        marginTop: '40px'
      }}
    >
            Powiadomienia
    </Typography>
    <Grid container direction='row' justifyContent="space-between" >
      <Box className={styles.notificationContainer}>
        { notifications && notifications?.length == 0 &&
                <a style={{ width: 'fit-content', padding: '15px', marginTop: '20px' }}>{'Tu będą powiadomienia o nadchodzących wydarzeniach'}</a>
        }
        {notifications && notifications?.length > 0 && notifications.map((el, index) => {
          return (
            <Link
              to={`/event/${el.identity.low}`}
              key={index}
              style={{ width: 'fit-content', padding: '15px', marginTop: '20px', border: '1px solid grey', borderRadius: '8px' }}>
              {`Wydarzenie ${el.properties.eventName}, w którym bierzesz udział, odbędzie się za 24h`}
            </Link>)
        })}
      </Box>
      <Box>
        {
          (!revies || revies.length == 0) &&
                <a style={{ width: 'fit-content', padding: '15px', marginTop: '20px' }}>{'Tu będą powiadomienia o ocenie poprzednich wydarzeniach'}</a>
        }
        {revies && revies?.length > 0 && revies.map((el, index) => {
          console.log(revies)

          return (
            <Box
              key={index}
              data-testid="review-item"
              style={{ width: 'fit-content', padding: '15px', marginTop: '20px', border: '1px solid blue', borderRadius: '8px' }}
              onClick={(()=>{isOpen(el)})}
            >
              Oceń Wydarzenie
              <a style={{ fontWeight:'bold' }}> {el.properties.eventName}</a>, w którym brałeś udział
            </Box>)
        })}
      </Box>
    </Grid>
    <RatingPopup open={open} handleClose={close} onSubmit={onSubmit} element={{ _fields:[element] }}/>
  </Box>
}

export default Notifications
