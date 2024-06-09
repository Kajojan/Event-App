import React from "react";
import Header from "../components/Header/Header";
import { Home } from "../components/Home";
import { useAuth0 } from "@auth0/auth0-react";

const Main = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  return (
    <div>
      <Header></Header>
      <Home></Home>
    </div>
  );
};

export default Main;
