import { Box } from '@mui/material'
import style from './Footer.module.scss'

const Footer = () => {

  return <Box className={style.FooterContainer} sx={{ height: '40px' }}>
    <a>Aplikacja stworzona przez <b>Kajetana Jankowskiego </b> jako projekt Licencjacki.</a>
  </Box>
}

export default Footer
