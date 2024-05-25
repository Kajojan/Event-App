import { Box, Divider, Typography, Button } from "@mui/material"
import React, { useEffect, useState } from "react"
import style from "./CurrentEvent.module.scss"
import apiData from "../../services/apiData"
import { useParams } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";


const CurrentEvent = () => {
  const { user } = useAuth0()
  const [item, setItem] = useState({})
  const [owner, setOwner] = useState("")
  const [takePart, setTakePart] = useState(false)
  const [seat, setSeat] = useState(null)

  const { id } = useParams();
  useEffect(() => {
    apiData.getEvent(id, user.email).then((res) => {
      setItem(res.data.event[0]._fields[0].properties)
      setOwner(res.data.event[0]._fields[1].properties.nickname)
      setTakePart(res.data.event[0]._fields[3] != null)
      setSeat(res.data.event[0]._fields[4]?.properties?.seat || null)
    }).catch((err) => {
      console.log(err);
    })
  }, [])
  const hasSeat = item?.seat?.low > 0 || item.seat == ""

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
          src="https://cache.marriott.com/content/dam/marriott-renditions/dm-static-renditions/continents/us-canada/en_us/lifestyle/photo/2022-photoshoot/limited/assets/pdt-b2b-812667705994678-168370154999290-wide-hor.jpg?interpolation=progressive-bilinear&downsize=600px:*"
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
        Organizator: {owner}
        <a>Date {item.eventDate}, {item.eventTime}</a>
        <a>Miejsce {item.address}</a>
        Opis
        <a>{item.eventDescription}</a>
        {item.seat && <a>Zostało jeszcze {item.seat.low} miejsc</a>}
        {item.seat == "" && <a>Wstęp wolny</a>}

        {seat && <a>Zarezerwowane miejsce  {seat}</a>}
      </Box>
    </Box>
    {
      !takePart && hasSeat &&
      <Button sx={{ marginBottom: "100px" }} onClick={() => { apiData.takePart({ email: user.email, id: id }).then((res) => { setTakePart(true) }) }}> Weż udział </Button>}
    {
      takePart && item.seat != "" &&
      <Button sx={{ marginBottom: "100px" }} onClick={() => { downloadQRWithLogo() }}> Pobierz Bilet </Button>}


  </Box>)
}

export default CurrentEvent