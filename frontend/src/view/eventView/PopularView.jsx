import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import EventList from "../../components/Events/EventList";
import { useDispatch, useSelector } from "react-redux";
import { getEvents } from "../../store/slices/socketSlice"
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@mui/material";

const PopularView = () => {
  const { user } = useAuth0()
  const dispatch = useDispatch()
  const [events, setEvents] = useState([])
  const socket = useSelector((state) => state.socket.socket)
  const [skip, setSkip] = useState(0)

  const connectAndCollect = (valueSkip) => {
    socket.on("receive_new_event_popular", (data) => {
      setEvents(prevEvents => [...prevEvents, ...data]);
      socket.off("receive_new_event_popular")
    });
    dispatch(getEvents({ name: "popular", skip: valueSkip, username: user.email }))

  }

  useEffect(() => {
    if (socket) {
      connectAndCollect(skip)
    }
  }, [socket])
  return (
    <div>
      <Header></Header>
      <EventList
        events={events}
        name={" Popularne wydarzenia"}
      ></EventList>
      <Button onClick={async () => {
        setSkip(prevSkip => prevSkip + 5);
        connectAndCollect(skip + 5)
      }}>More</Button>
    </div >
  );
};

export default PopularView;
