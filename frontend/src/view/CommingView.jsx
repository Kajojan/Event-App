import React, { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import EventList from "../components/Events/EventList";
import { useDispatch, useSelector } from "react-redux";
import { getEvents } from "../store/slices/socketSlice"
import { useAuth0 } from "@auth0/auth0-react";

const CommingView = () => {
  const { user } = useAuth0()
  const dispatch = useDispatch()
  const [events, setEvents] = useState([])
  const socket = useSelector((state) => state.socket.socket)
  const [skip, setSkip] = useState(0)

  useEffect(() => {
    if (socket) {

      socket.once("receive_new_event_inComing", (data) => {
        setEvents(data)
      });
      dispatch(getEvents({ name: "incomming", skip, username: user.email }))
    }
  }, [socket])
  return (
    <div>
      <Header></Header>
      <EventList
        events={events}

        name={"Nadchodzące wydarzenia"}
      ></EventList>
    </div>
  );
};

export default CommingView;
