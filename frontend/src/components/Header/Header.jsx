import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";
import { Box, Menu, Typography, Button } from "@mui/material";
import styles from "./Header.module.scss";
import { EventIcon, MenuIcon } from "../icons";
import Search from "../Search/Search";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "../../store/slices/socketSlice";
import { useLocation } from "react-router-dom";

const Header = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const socket = useSelector(state => state.socket.socket)
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(location, isAuthenticated, socket);
    if (isAuthenticated && socket == null) {
      dispatch(connect({ user }));
    }
  }, [location]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box className={styles.headerWrapper}>
      <Box className={styles.leftIconHeader}>
        <Link to="/" className={styles.logo}>
          <EventIcon className={styles.icon}></EventIcon>
          <a href="#">
            <span>Event</span>
            <span style={{ color: "blue" }}>App</span>
          </a>
        </Link>
      </Box>
      <Button
        id="fade-button"
        aria-controls={open ? "fade-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <MenuIcon></MenuIcon>
      </Button>
      <Menu
        id="fade-menu"
        MenuListProps={{
          "aria-labelledby": "fade-button",
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
        <hr></hr>
        {isAuthenticated ? (
          <MenuItem onClick={handleClose}>
            <Link to="/profile">profile </Link>
          </MenuItem>
        ) : (
          <MenuItem onClick={loginWithRedirect}>Zaloguj się</MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default Header;
