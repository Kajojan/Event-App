import { Box,Divider,Typography,Button } from "@mui/material"
import React from "react"
import style from "./CurrentEvent.module.scss"



const CurrentEvent =({item})=>{

    return(<Box>
<Typography
        variant="h1"
        fontWeight="500"
        className={style.Typography_home}
        sx={{
          fontSize: ["xx-large", "xx-large", "xxx-large", "xxx-large"],
          paddingLeft: [0, 0, 3, 0],
        }}
      >
        Tytuł
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
        Organizator
        <a>Date</a>
        <a>Miejsce</a>
      </Box>
        </Box>
        {
        // item.res && 
        <Button sx={{marginBottom: "100px"}} onClick={()=>{}}> Rezerwacja </Button>}
        {
        // !item.res && 
        <Button sx={{marginBottom: "100px"}} onClick={()=>{}}> Pobierz Bilet </Button>}
        

    </Box>)
}

export default CurrentEvent