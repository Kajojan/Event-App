import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import style from './EventForm.module.scss'
import { Box, Button, Checkbox, Typography } from '@mui/material'
import Event from './Event'
import PlacesAutocomplete from 'react-places-autocomplete'
import { useDispatch } from 'react-redux'
import { useAuth0 } from '@auth0/auth0-react'
import { addEvent } from '../../store/slices/socketSlice'
import apiData from '../../services/apiData'
import { eventTypes } from '../helper/EventTypes'
import ImageSelector from './EventFormPopUp'
import { useNavigate } from 'react-router-dom'


function EventForm() {
  const navigate = useNavigate()
  const [arrImages, setArrImages] = useState([])
  const [value, setValue] = useState('')
  const [tagsArr, setTagsArray] = useState(eventTypes)
  const [image, setImage] = useState('')
  const [change, setChange] = useState(false)
  const { user } = useAuth0()
  const dispatch = useDispatch()
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
  const setImageData = (img)=>{
    setImage(img)
    setFormData({
      '_fields': [
        {
          properties: {
            ...formData._fields[0].properties,
            eventImage: img
          }
        },
        {
          properties: {
            ...formData._fields[1].properties
          }
        }]
    })

  }

  useEffect(() => {
    apiData.getImage().then((res) => {
      setArrImages(res.data)
      setImageData(res.data[1])
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [check, setCheck] = useState(false)
  const [error, setError] = useState(false)
  const [typeError, setTypeError] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const [address, setAddress] = useState('')
  const [detailAddress, setDetailAddress] = useState('')

  useEffect(()=>{

    const geocoder = new window.google.maps.Geocoder()
    geocoder.geocode({ address: address }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const components = results[0].address_components
        const addresData = {}

        components.forEach((el, _index)=>{
          addresData[el.types[0]] = el.long_name
        })
        setDetailAddress(objectToString(addresData))
      }
    })
  }, [address])

  const [arrayType, setArrayType] = useState([])
  const objectToString = (obj)=>{
    return Object.entries(obj)
      .map(([key, value]) => `${key}:${value}`)
      .join('; ')
  }
  const addType = (type)=>{
    if (arrayType.length < 3) {
      arrayType.includes(type) ? setArrayType(arrayType.filter((el)=>el != type)) : setArrayType([...arrayType, type])
    } else {
      arrayType.includes(type) ? setArrayType(arrayType.filter((el)=>el != type)) : setArrayType(arrayType)
    }
  }
  const see = (data) => {
    const { eventImage, ...dataWithoutImage } = data
    const Eventdata = data?.eventImage && data.eventImage.length > 0 ? data : dataWithoutImage

    if (address != '' && detailAddress != '') {
      setFormData({
        '_fields': [
          {
            properties: {
              ...formData._fields[0].properties,
              ...Eventdata,
              address,
              detailAddress
            }
          },
          {
            properties: {
              ...formData._fields[1].properties
            }
          }
        ]
      })
    }
  }
  const onSubmit = (data) => {
    if (arrayType.length != 3) {
      setTypeError(true)
    }
    else if (address != '' && detailAddress != '') {
      see(data)
      setError(false)

      if (data?.eventImage && data.eventImage.length > 0 && data.eventImage[0] != null) {
        const formData = new FormData()
        formData.append('file', data.eventImage[0])
        apiData.sendFile(formData).then((res) => {
          dispatch(addEvent({ event: { content: { ...data, address, detailAddress, eventImage: res.data.result, arrayType }, owner: user.email } }))
          navigate('/')
        })

      } else {
        dispatch(addEvent({ event: { content: { ...data, address, detailAddress, eventImage: image, arrayType }, owner: user.email } }))
        navigate('/')
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
  const checkboxChange = () => {
    setCheck(!check)
  }

  const searchTags = (e) => {
    const value = e.target.value

    setValue(value)
    const filtered = eventTypes.filter((tag) =>
      tag.toLowerCase().includes(value.toLowerCase())
    )
    setTagsArray(filtered)
  }

  return (
    <Box>
      <Typography
        variant="h1"
        fontWeight="600"
        className={style.Typography_home}
        sx={{
          fontFamily: '"Noto Sans", sans-serif',
          fontSize: ['xx-large', 'xx-large', 'xxx-large', 'xxx-large'],
          paddingLeft: [0, 0, 3, 0],
          marginTop:'40px'
        }}
      >
        Utwórz nowe Wydarzenie
      </Typography>
      <Box className={style.form_main_container}>
        <Box className={style.event}>
          <Event item={formData}></Event>

          <Button onClick={() => { setChange(!change) }}> Zmień obrazek</Button>

          <Button onClick={handleSubmit(see)}> Podgląd</Button>
        </Box>
        <ImageSelector setImage={setImageData} setChange={setChange} change={change} images={arrImages}/>
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
                <div style={{ margin: '0' }}>
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
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <label style={{ alignContent: 'center' }}>Ograniczona Ilość miejsc:</label>
            <Checkbox onChange={() => { checkboxChange() }}></Checkbox>
          </div>
          {check && <div className={style.desc}>
            <label htmlFor="seat">Liczba miejsc</label>
            <input id="seat" type="number" min="1" {...register('seat')} />
          </div>}
          <label style={{ marginBottom: '10px' }}>Wybierz 3 typy wydarzenia</label>
          {typeError && <span style={{ marginBottom:'10px' }}>Musisz wybrać 3 typy</span>}
          <input onChange={searchTags} value={value} type="text" placeholder='Wyszukaj typ'></input>
          <div className={style.typeContainer}>
            {tagsArr.map((el, index)=>(
              <p key={index} onClick={()=>{addType(el)}} className={arrayType.includes(el) ? style.Type_active : style.NotActive} >{el}</p>
            ))}
          </div>
          <Button type="submit">Dodaj</Button>

        </form>
      </Box>
    </Box>
  )
}

export default EventForm
