import React from "react";
import Header from "../../components/Header/Header";
import { useAuth0 } from "@auth0/auth0-react";
import EventForm from "../../components/Events/EventFrom";

const CreateEventView = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  return (
    <div>
      <Header></Header>
      <EventForm></EventForm>
    </div>
  );
};

export default CreateEventView;
