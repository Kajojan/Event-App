import { Box, Typography } from '@mui/material'

const NoDataBox = () => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '300px',
        border: '2px dashed #ccc',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9f9f9',
        color: '#666',
        p: 2,
      }}
    >
      <Box
        component="svg"
        xmlns="http://www.w3.org/2000/svg"
        width="60"
        height="60"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#999"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        sx={{ mb: 2 }}
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12" y2="8" />
      </Box>

      <Typography variant="h6" fontWeight="bold">
        Brak danych
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Spróbuj odświeżyć stronę lub sprawdź połączenie.
      </Typography>
    </Box>
  )
}

export default NoDataBox
