import { useState } from 'react'
import { Modal, Box, Typography, TextField, Button, Rating } from '@mui/material'
import PropTypes from 'prop-types'
import Event from '../Events/Event'
import styles from './Review.module.scss'

export default function RatingPopup({ open, handleClose, onSubmit, element }) {
  const [stars, setStars] = useState(0)
  const [text, setText] = useState('')

  const handleTextChange = (e) => {
    const words = e.target.value.split(/\s+/)
    if (words.length <= 50) {
      setText(e.target.value)
    }
  }

  const handleSubmit = () => {
    if (stars > 0) {
      onSubmit({ stars, text })
      setStars(0)
      setText('')
      handleClose()
    }
  }

  return (
    <Modal open={open} onClose={handleClose}>

      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >

        <Typography variant="h6">Oceń wydarzenie</Typography>

        <Rating
          name="simple-controlled"
          value={stars}
          onChange={(event, newValue) => {
            setStars(newValue)
          }}
        />

        <TextField
          label="Twoja opinia"
          multiline
          rows={4}
          value={text}
          onChange={handleTextChange}
          placeholder="Maksymalnie 50 słów..."
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button variant="outlined" onClick={handleClose}>
            Zamknij
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            Wyślij ocenę
          </Button>
        </Box>
        <Event item={element} onClick={()=>{}} className={styles.RevieEvent}></Event>
      </Box>
    </Modal>
  )
}
RatingPopup.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  element: PropTypes.object.isRequired,
}
