import React, { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import EventList from "../components/Events/EventList";
import { useDispatch, useSelector } from "react-redux";
import { getEvents } from "../store/slices/socketSlice"
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';

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
      <img src={"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAYAAAB1PADUAAAAAklEQVR4AewaftIAAATUSURBVO3BQY4cSRIEQdNA/f/Lun30UwCJ9GpyuCaCP1K15KRq0UnVopOqRSdVi06qFp1ULTqpWnRSteikatFJ1aKTqkUnVYtOqhadVC06qVr0yUtAfpOaJ4B8k5obIDdqboD8JjVvnFQtOqladFK16JNlajYBeUPNE0AmNROQGyCTmhsgk5obNZuAbDqpWnRSteikatEnXwbkCTWbgNyomdRMQG6APAFkUvMGkCfUfNNJ1aKTqkUnVYs++ccAuVEzAZnUvKFmAjKp+ZedVC06qVp0UrXok3+Mmhsg3wTkBsik5l9yUrXopGrRSdWiT75MzTcBmdTcqJmATEA2qZmATEAmNU+o+ZucVC06qVp0UrXok2VA/iZAJjU3aiYgk5oJyKRmAjKpmYA8AeRvdlK16KRq0UnVIvyRfwiQGzVPAJnU3ACZ1Pw/OaladFK16KRq0ScvAZnU3ACZ1ExAbtRMQCY1N0AmNROQSc0Tat4AMqmZgExq/iYnVYtOqhadVC365MuAvKFmAjKpmYD8JiA3at4AMqm5ATKpmYDcqHnjpGrRSdWik6pF+CO/CMiNmgnIpOYJIJOaCcgTaiYgk5obIJOaCcikZgJyo2YCcqNm00nVopOqRSdViz75w9TcqHkCyN8EyCY1E5C/yUnVopOqRSdVi/BHXgAyqZmA3KiZgDyh5gkgk5obIG+oeQLIE2qeAHKj5o2TqkUnVYtOqhZ98pKaN4BMam6AfBOQSc0TQCYgb6h5AsiNmm86qVp0UrXopGrRJ1+m5gbIDZBJzQRkUrMJyKTmCTU3QCY1E5BJzRNqJiA3at44qVp0UrXopGrRJy8BmdRMQCY1T6iZgDwB5Ak13wRkUnOj5gk1N2q+6aRq0UnVopOqRZ8sAzKpmYBMaiYgN2qeUHMD5EbNBGRS84SaCciNmgnIjZongExq3jipWnRSteikahH+yB8E5EbNG0AmNTdAbtRMQCY1m4DcqJmATGomIDdq3jipWnRSteikatEnLwGZ1ExA3gAyqZmAPAHkRs0E5A0gk5oJyKTmRs0E5AbIbzqpWnRSteikahH+yBcBeUPNnwRkUnMDZJOaCcik5m9yUrXopGrRSdUi/JEXgExqngAyqZmA3Kj5TUBu1NwA+SY1E5An1LxxUrXopGrRSdUi/JH/MCCTmgnIE2omIJOaCcik5gbIjZongNyo+U0nVYtOqhadVC3CH3kByG9S8waQGzVPALlRcwNkUjMBmdRMQN5Qs+mkatFJ1aKTqkWfLFOzCcgNkEnNE2pugNyo+SY1T6iZgExqJiCTmjdOqhadVC06qVr0yZcBeULNE2omIJOaN9TcAHlCzQ2QTWomIN90UrXopGrRSdWiT/7jgGwCMqm5UTMBmdRMQCY1N0CeAPKEmk0nVYtOqhadVC365D9OzQ2QGyA3QCY1E5AbIE8AmdRMQG7UTEAmNROQSc0bJ1WLTqoWnVQt+uTL1PxJam6ATGomIDdqJiCTmgnIBOQGyKTmCTUTkEnNppOqRSdVi06qFn2yDMhvAjKpmYBsAjKpmdTcqJmATGomIDdAbtT8ppOqRSdVi06qFuGPVC05qVp0UrXopGrRSdWik6pFJ1WLTqoWnVQtOqladFK16KRq0UnVopOqRSdVi06qFv0Pi9I2P2Tx/IsAAAAASUVORK5CYII="} alt="QR Code" />
    </div>
  );
};

export default RecomendedView;
