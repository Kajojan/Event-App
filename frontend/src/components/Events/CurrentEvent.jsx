import { Box, Divider, Typography, Button, Grid } from "@mui/material"
import React, { useEffect, useState } from "react"
import style from "./CurrentEvent.module.scss"
import apiData from "../../services/apiData"
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import { PeopleIcon } from "../icons"


const CurrentEvent = () => {
  const navigate = useNavigate()
  const { user } = useAuth0()
  const [item, setItem] = useState({})
  const [owner, setOwner] = useState("")
  const [takePart, setTakePart] = useState(false)
  const [seat, setSeat] = useState(null)

  const { id } = useParams();
  useEffect(() => {
    apiData.getEvent(id, user.email).then((res) => {
      setItem(res.data.event[0]._fields[0].properties)
      setOwner(res.data.event[0]._fields[1].properties)
      setTakePart(res.data.event[0]._fields[3] != null)
      setSeat(res.data.event[0]._fields[4]?.properties?.seat || null)
    }).catch((err) => {
      console.log(err);
    })
  }, [])
  const hasSeat = item?.seat > 0 || item.seat == ""

  const downloadQRWithLogo = () => {
    apiData.qrcode({ email: user.email, name: user.name, event: item.eventName, seat }).then((res) => {
      const link = document.createElement('a');
      link.href = res.data.qrCodeBase64;
      link.download = 'BiletQR.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
  };

  return (<Box>
    <Typography
      variant="h1"
      fontWeight="500"
      className={style.Typography_home}
      sx={{
        fontSize: ["xx-large", "xx-large", "xxx-large", "xxx-large"],
        paddingLeft: [0, 0, 3, 0],
      }}
    >
      {item.eventName}
    </Typography>
    <Box>
      <Box className={style.event_image}>
        <img
          src={item.eventImage}
          alt="EventImage"
        />
      </Box>
      <Divider
        sx={{
          "&::before, &::after": {
            borderColor: "#0000ff",
          },
        }}
        style={{ width: "60%", marginTop: "20px", margin: "0 auto" }}
        textAlign="left">Szczegłóły </Divider>
      <Box className={style.event_content}>
        <Box className={style.peopleContainer}>
          {seat && <a className={style.leftAText}> Twoje Zarezerwowane miejsce: <b>{seat}</b></a>}
          {(item.seat > 0 || item.seat) && <a>Zostało jeszcze <b>{item.seat.low || item.seat}</b> miejsc </a>}
          {item.seat == "" && <a>Wstęp wolny</a>}
          <PeopleIcon></PeopleIcon>
        </Box>


        <Grid container spacing={2} direction="row" justifyContent="space-around" >
          <Grid item xs={4} container direction="column">
            <Typography variant="body1">Organizator</Typography>
            <Typography variant="body1">Date</Typography>
            <Typography variant="body1">Miejsce</Typography>
            {item.eventDescription && <Typography variant="body1">Opis</Typography>}
          </Grid>
          <Grid item xs={4} container direction="column" >
            <Typography variant="body1" sx={{ fontWeight: "bolder" }}>{owner.nickname}</Typography>
            <Typography variant="body1" sx={{ fontWeight: "bolder" }}>{item.eventDate} {item.eventTime}</Typography>
            <Typography variant="body1" sx={{ fontWeight: "bolder" }}>{item.address}</Typography>
            <Typography variant="body1" sx={{ fontWeight: "bolder" }}>{item.eventDescription}</Typography>
          </Grid>
        </Grid>
      </Box>

    </Box>
    {
      !takePart && hasSeat && owner.email !== user.email && 
      <Button sx={{ marginBottom: "100px" }} onClick={() => { apiData.takePart({ email: user.email, id: id }).then((res) => { setTakePart(true) }) }}> Weż udział </Button>}
    {
      takePart && item.seat != "" && owner.email !== user.email && 
      <Button sx={{ marginBottom: "100px" }} onClick={() => { downloadQRWithLogo() }}> Pobierz Bilet </Button>}
      {owner.email === user.email && <Button sx={{ marginBottom: "100px" }} onClick={()=>navigate(`/event/${id}/edit`)} >Edytuj</Button> }
      {owner.email === user.email && <Button sx={{ marginBottom: "100px" }} onClick={()=>apiData.deleteEvent(id).then((res)=>navigate('/'))} >Usuń</Button> }

  </Box>)
}

export default CurrentEvent