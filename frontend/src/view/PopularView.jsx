import React, { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import EventList from "../components/Events/EventList";
import { useDispatch, useSelector } from "react-redux";
import { getEvents } from "../store/slices/socketSlice"
import { useAuth0 } from "@auth0/auth0-react";

const PopularView = () => {
  const { user } = useAuth0()
  const dispatch = useDispatch()
  const [events, setEvents] = useState([])
  const socket = useSelector((state) => state.socket.socket)
  const [skip, setSkip] = useState(0)

  useEffect(() => {
    socket.once("receive_new_event_popular", (data) => {
      setEvents(data)
      console.log(data);
    });
    dispatch(getEvents({ name: "popular", skip, username: user.email }))
  }, [])
  return (
    <div>
      <Header></Header>
      <EventList
        events={events}
        //   { el: [], elleme: [] },
        //   { el: [], elleme: [] },
        //   { el: [], elleme: [] },
        //   { el: [], elleme: [] },
        //   { el: [], elleme: [] },
        //   { el: [], elleme: [] },
        //   { el: [], elleme: [] },
        //   { el: [], elleme: [] },
        //   { el: [], elleme: [] },
        //   { el: [], elleme: [] },
        //   { el: [], elleme: [] },
        //   { el: [], elleme: [] },
        //   { el: [], elleme: [] },
        //   { el: [], elleme: [] },
        //   { el: [], elleme: [] },
        // ]}
        name={" Popularne wydarzenia"}
      ></EventList>
    </div>
  );
};

export default PopularView;
