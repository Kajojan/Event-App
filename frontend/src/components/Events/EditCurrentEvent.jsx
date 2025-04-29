import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import style from './EventForm.module.scss'
import { Box, Button, Typography } from '@mui/material'
import Event from './Event'
import PlacesAutocomplete from 'react-places-autocomplete'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate, useParams } from 'react-router-dom'
import apiData from '../../services/apiData'

function EventForm() {
  const [image, setImage] = useState('')
  const { user } = useAuth0()
  const { id } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    '_fields': [
      {
        properties: {
        },
      }, {
        properties: {
          nickname: user.nickname,
        },
      }
    ]
  })
  const changeImage = () => {
    apiData.getImage().then((res) => {
      setImage(res.data)
      setFormData({
        '_fields': [
          {
            properties: {
              ...formData._fields[0].properties,
              eventImage: res.data
            }
          },
          {
            properties: {
              ...formData._fields[1].properties
            }
          }]
      })
    })
  }

  useEffect(() => {
    apiData.getEvent(id, user.email).then((res) => {
      setFormData({
        '_fields': [
          {
            properties: {
              ...res.data.event[0]._fields[0].properties,
            }
          },
          {
            properties: {
              ...res.data.event[0]._fields[1].properties,
            }
          }]
      })
      const keys = Object.keys(res.data.event[0]._fields[0].properties)
      keys.forEach(element => {
        if (element == 'seat') {
          setValue(element, res.data.event[0]._fields[0].properties[element].low)
        } else {
          setValue(element, res.data.event[0]._fields[0].properties[element])
        }
      })
      setAddress(res.data.event[0]._fields[0].properties.address)
      setImage(res.data.event[0]._fields[0].properties.eventImage)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [error, setError] = useState(false)
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()


  const [address, setAddress] = useState('')

  const see = (data) => {
    const { eventImage, ...dataWithoutImage } = data
    const Eventdata = image ? { ...data, eventImage: image } : dataWithoutImage
    console.log(image, eventImage, Eventdata)
    if (address != '') {
      setFormData({
        '_fields': [
          {
            properties: {
              ...formData._fields[0].properties,
              ...Eventdata,
              address
            }
          },
          {
            properties: {
              ...formData._fields[1].properties
            }
          }
        ]
      })
      console.log(formData, data)
    }
  }
  const onSubmit = (data) => {
    if (address != '') {
      see(data)
      setError(false)
      if (data.eventImage != image && image != formData._fields[0].properties.eventImage) {
        const formData = new FormData()
        formData.append('file', data.eventImage[0])
        apiData.sendFile(formData).then((res) => {
          apiData.editEvent(id, { ...data, address, eventImage: res.data.result })
        })
      } else {
        console.log({ event: { content: { ...data, address, eventImage: image }, owner: user.email } })
        apiData.editEvent(id, { ...data, address, eventImage: image }).then((_res)=>{
          navigate(`/event/${id}`)
        })

      }
    } else {
      setError(true)
    }
  }

  const handleSelect = (selectedAddress) => {
    setAddress(selectedAddress)
    setError(false)
  }

  const handleChange = (newAddress) => {
    setAddress(newAddress)
    setError(false)
  }


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
        Utwórz nowe Wydarzenie
      </Typography>
      <Box
        sx={{
          flexDirection: 'row',
          display: 'flex',
          backgroundColor: '#f5f5f5',
          borderRadius: '20px',
          margin: '20px',

          justifyContent: 'space-around',
        }}
      >
        <Box sx={{ marginBottom: '20px', marginLeft: '30px', width: '300px', alignSelf: 'center', display: 'flex', flexDirection: 'column' }}>
          <Event item={formData}></Event>

          <Button onClick={() => { changeImage() }}> Zmień obrazek</Button>

          <Button onClick={handleSubmit(see)}> Podgląd</Button>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)} className={style.container}>
          <div className={style.name}>
            <label htmlFor="eventName" >Nazwa Wydarzenia</label>
            <input type="text" id="eventName" {...register('eventName', { required: true })} />
            {errors.eventName && <span>Pole Wymagane</span>}
          </div>
          <div className={style.TimeDate}>
            <div className={style.time}>
              <label htmlFor="eventTime">Czas rozpoczęcia</label>
              <input type="time" id="eventTime" {...register('eventTime', { required: true })} />
              {errors.eventTime && <span>Pole Wymagane</span>}
            </div>
            <div className={style.date}>
              <label htmlFor="eventDate">Data wydarzenia</label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                id="eventDate"
                {...register('eventDate', { required: true })}
              />
              {errors.eventDate && <span>Pole Wymagane</span>}
            </div>
          </div>

          <div className={style.loc}>
            <label htmlFor="eventLocation">Lokalizacja</label>
            <PlacesAutocomplete value={address} onChange={handleChange} onSelect={handleSelect}>
              {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <div>
                  <input {...getInputProps({ placeholder: 'Type address' })} />
                  <div style={{ backgroundColor: 'white', borderRadius: '20px', margin: '0' }}>
                    {loading ? <div>Loading...</div> : null}

                    {suggestions.map((suggestion, index) => {
                      const style = {
                        textDecoration: suggestion.active ? 'underline #0000ff' : 'none',
                        fontSize: suggestion.active ? '15px' : '12px',
                        marginTop: '4px',
                      }
                      return (
                        <div
                          key={index}
                          className={style.LocDiv} {...getSuggestionItemProps(suggestion, { style })}>
                          {suggestion.description}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </PlacesAutocomplete>
            {error && <span>Pole Wymagane</span>}
          </div>

          <div className={style.photo}>
            <label htmlFor="eventImage">Zdjęcie</label>
            <input type="file" accept=".png, .jpg, .jpeg" id="eventImage" {...register('eventImage')} />
          </div>

          <div className={style.desc}>
            <label htmlFor="eventDescription">Opis wydarzenia</label>
            <textarea id="eventDescription" {...register('eventDescription')} />
          </div>

          <div className={style.desc}>
            <label htmlFor="seat">Liczba miejsc</label>
            <input id="seat" type="number" min="1" {...register('seat')} />
          </div>
          <Button type="submit">Zapisz</Button>

        </form>
      </Box>
    </Box>
  )
}

export default EventForm
