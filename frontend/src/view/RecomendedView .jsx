import React, { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import EventList from "../components/Events/EventList";
import { useDispatch, useSelector } from "react-redux";
import { getEvents } from "../store/slices/socketSlice"
import { useAuth0 } from "@auth0/auth0-react";

const RecomendedView = () => {
  const { user } = useAuth0()
  const dispatch = useDispatch()
  const [events, setEvents] = useState([])
  const socket = useSelector((state) => state.socket.socket)
  const [skip, setSkip] = useState(0)

  useEffect(() => {
    socket.once("receive_new_event_reco", (data) => {
      setEvents(data)
    });
    dispatch(getEvents({ name: "recommended", skip, username: user.email }))
  }, [])
  return (
    <div>
      <Header></Header>
      <EventList
        events={events}
        name={"Rekomendowane wydarzenia"}
      ></EventList>
    </div>
  );
};

export default RecomendedView;
