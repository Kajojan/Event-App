import React from "react";
import Header from "../../components/Header/Header";
import { Home } from "../../components/Home";
import { useAuth0 } from "@auth0/auth0-react";
import { HomeLogin } from "../../components/Home";
import EventMain from "../../components/Events/EventMain";

const Main = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  return (
    <div>
      <Header></Header>
      <EventMain></EventMain>
    </div>
  );
};

export default Main;
