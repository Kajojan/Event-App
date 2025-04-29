import { Box, Link, Typography } from '@mui/material'
import style from './Event.module.scss'
import { CreateIcon, TimeIcon, PopularIcon, RecommendedIcon } from '../icons'
import { useNavigate } from 'react-router-dom'

const EventMain = () => {
  const navigate = useNavigate()

  return (
    <Box>
      <Typography
        variant="h1"
        fontWeight="500"
        className={style.Typography_home}
        sx={{
          fontSize: ['xx-large', 'xx-large', 'xxx-large', 'xxx-large'],
          paddingLeft: [0, 0, 3, 0],
          marginTop:'40px'
        }}
      >
        Wydarzenia
      </Typography>
      <Box className={style.box_container}>
        <Box className={style.box} onClick={() => navigate('/event/create')}>
          <Link>Utwórz nowe</Link>
          <CreateIcon></CreateIcon>
        </Box>
        <Box className={style.box} onClick={() => navigate('/event/yourincomming')}>
          <Link>Twoje wydarzenia</Link>
          <TimeIcon></TimeIcon>
        </Box>
        <Box className={style.box} onClick={() => navigate('/event/popular')}>
          <Link>Popularne</Link>
          <PopularIcon></PopularIcon>
        </Box>
        <Box className={style.box_container_row2}>

          <Box className={style.box} onClick={() => navigate('/event/recomended')}>
            <Link>Rekomendowane</Link>
            <RecommendedIcon></RecommendedIcon>
          </Box>
          <Box className={style.box} onClick={() => navigate('/event/comming')}>
            <Link>Nadchodzące</Link>
            <TimeIcon></TimeIcon>
          </Box>
        </Box>
        {/* <Box onClick={() => navigate("/event/map")}>
          <Link>Map</Link>
          <MapIcon></MapIcon>
        </Box> */}
      </Box>
    </Box>
  )
}
export default EventMain
