import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";

import { Box, Typography } from "@mui/material";
import styles from "./Header.module.scss";
import { EventIcon } from "../icons";
import Search from "../Search/Search";
const Header = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();

  return (
    <Box className={styles.headerWrapper}>
      <Box>
        <Link to="/" className={styles.logo}>
          <EventIcon className={styles.icon}></EventIcon>
          <a href="#">
            <span>Event</span>
            <span style={{ color: "blue" }}>App</span>
          </a>
        </Link>
      </Box>
      <Search />
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
