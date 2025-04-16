import React, { useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Link } from 'react-router-dom'
import { Box, Menu, Button } from '@mui/material'
import styles from './Header.module.scss'
import { DotIcon, EventIcon, MenuIcon } from '../icons'
import MenuItem from '@mui/material/MenuItem'
import Fade from '@mui/material/Fade'
import { useDispatch, useSelector } from 'react-redux'
import { connect } from '../../store/slices/socketSlice'
import { useLocation } from 'react-router-dom'

const Header = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0()
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const notifications = useSelector(state => state.socket.isNotification)
  const socket = useSelector(state => state.socket.socket)
  const location = useLocation()
  const dispatch = useDispatch()


  useEffect(() => {
    if (isAuthenticated && (socket == null || !socket?.connected)) {
      console.log(user)
      dispatch(connect({ user }))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box className={styles.headerWrapper}>
      <Box className={styles.leftIconHeader}>
        <Link to="/" className={styles.logo}>
          <EventIcon className={styles.icon}></EventIcon>
          <a href="#">
            <span>Event</span>
            <span style={{ color: 'blue' }}>App</span>
          </a>
        </Link>
      </Box>
      <Button
        id="fade-button"
        data-testid="button-id"
        aria-controls={open ? 'fade-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <MenuIcon></MenuIcon>{!open && notifications != 0 && <span style={{ marginBottom: '20px', marginLeft: '-5px', color: 'red', fontWeight: 'bolder' }}><DotIcon></DotIcon></span>}
      </Button>
      <Menu
        id="fade-menu"
        MenuListProps={{
          'aria-labelledby': 'fade-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={handleClose}>
          <Link to="/">Głowna</Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Link to="/event">Wydarzenia</Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Link to="/search">Wyszukaj</Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Link to="/notifications">Powiadomienia</Link>{notifications != 0 && <span style={{ marginBottom: '20px', marginLeft: '-6px', color: 'red', fontWeight: 'bolder' }}><DotIcon></DotIcon></span>}
        </MenuItem>
        <hr></hr>
        {isAuthenticated ? (
          <MenuItem onClick={handleClose}>
            <Link to="/profile">{user.email} </Link>
          </MenuItem>
        ) : (
          <MenuItem onClick={loginWithRedirect}>Zaloguj się</MenuItem>
        )}
      </Menu>
    </Box>
  )
}

export default Header
