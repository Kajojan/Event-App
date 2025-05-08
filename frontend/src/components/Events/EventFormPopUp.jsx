import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Button,
  DialogActions,
} from '@mui/material'
import PropTypes from 'prop-types'

export default function ImageSelector({ setImage, setChange, change, images }) {

  const handleSelect = (img) => {
    setImage(img)
    setChange(false)
  }

  return (
    <Dialog open={change} onClose={() => setChange(false)} fullWidth maxWidth="sm">
      <DialogTitle>Wybierz zdjęcie</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          {images.map((img, idx) => (
            <Grid item xs={4} key={idx}>
              <img
                src={img}
                alt={`Zdjęcie ${idx + 1}`}
                style={{
                  width: '100%',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  border: '2px solid transparent',
                }}
                onClick={() => handleSelect(img)}
              />
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setChange(false)}>Anuluj</Button>
      </DialogActions>
    </Dialog>
  )
}

ImageSelector.propTypes = {
  setImage: PropTypes.func.isRequired,
  setChange: PropTypes.func.isRequired,
  change: PropTypes.bool.isRequired,
  images: PropTypes.array.isRequired
}
