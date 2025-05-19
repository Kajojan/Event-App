/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Link } from 'react-router-dom'
import 'leaflet/dist/leaflet.css'

import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import apiData from '../../services/apiData'
import { Box, CircularProgress, Typography } from '@mui/material'

delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))


const AddressMap = () => {
  const [locations, setLocations] = useState([])

  const [rawAddresses, setAddresses] = useState([])

  const parseAddress = (detailAddress) => {
    const parts = detailAddress.split('; ').map((p) => p.split(':'))
    const obj = Object.fromEntries(parts)
    return `${obj.route || ''} ${obj.street_number || ''}, ${obj.locality || ''}, ${obj.country || ''}`
  }
  const geocodeAddress = async (address) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`,
        {
          headers: {
            'User-Agent': 'YourAppName/1.0 (kajetan.kajo.jankowski@gmail.com)',
          },
        }

      )

      if (!res.ok) {
        console.error(`Błąd żądania: ${res.status} ${res.statusText}`)
        return null
      }

      const data = await res.json()
      if (!Array.isArray(data) || data.length === 0) {
        return null
      }

      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        label: address
      }

    } catch (err) {
      console.error('Błąd podczas geokodowania adresu:', err)
      return null
    }
  }


  const loadLocations = async (data) => {
    const results = []

    for (const [id, [detailAddress, eventName]] of Object.entries(data)) {
      const formatted = parseAddress(detailAddress)
      await delay(1000)
      const loc = await geocodeAddress(formatted)

      if (loc) {
        results.push({
          id,
          name: eventName,
          coordinates: loc,
        })
      }
    }

    setLocations(results)
  }


  useEffect(() => {
    const date = new Date()
    date.setHours(date.getHours() + 2)
    apiData.filtersEvents({ 'startDate': date, 'limit': 10 }).then((res)=>{
      const data = res.data.reduce((acc, el)=>{
        acc[el._fields[0].identity.low] = [el._fields[0].properties.detailAddress, el._fields[0].properties.eventName]
        return acc
      }, {})
      setAddresses(data)
      loadLocations(data)
    })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box>
      <Typography
        variant="h1"
        fontWeight="600"
        sx={{
          fontFamily: '"Noto Sans", sans-serif',
          fontSize: ['xx-large', 'xx-large', 'xxx-large', 'xxx-large'],
          paddingLeft: [0, 0, 3, 0],
          marginTop:'40px'
        }}
      >
        Mapa
      </Typography>
      {locations.length > 0 ? (<MapContainer center={[52.237, 21.017]} zoom={6} style={{ height: '500px', width: '100%', marginBlock:'50px', borderRadius:'20px' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {locations.map((loc) => (
          loc.coordinates ? (
            <Marker key={loc.id || loc.name} position={[loc.coordinates.lat, loc.coordinates.lng]}>
              <Popup><Link to={`/event/${loc.id}`}>{loc.name}</Link></Popup>
            </Marker>
          ) : null
        ))}
      </MapContainer>) : <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '150px',
        }}
      >
        <CircularProgress />
      </Box>}
    </Box>
  )
}

export default AddressMap
