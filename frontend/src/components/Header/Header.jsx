import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";

import { Box, Typography, Button } from "@mui/material";
import styles from "./Header.module.scss";
import { Event } from "../icons";
const Header = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();

  return (
    <Box className={styles.headerWrapper}>
      <Box>
        <Link to="/" className={styles.logo}>
          <Event className={styles.icon}></Event>
          <Typography> EventApp</Typography>
        </Link>
      </Box>
      <a> Search Component</a>
      {isAuthenticated ? (
        <Link to="/profile">{user.name} </Link>
      ) : (
        <button className="btn-primary" onClick={loginWithRedirect}>
          Log in
        </button>
      )}
    </Box>
  );
};

export default Header;
