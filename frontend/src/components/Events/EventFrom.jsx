import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import style from "./EventForm.module.scss";
import { Box, Button, Checkbox, Typography } from "@mui/material";
import Event from "./Event";
import PlacesAutocomplete from "react-places-autocomplete";
import { useDispatch } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";
import { addEvent } from "../../store/slices/socketSlice";
import apiData from "../../services/apiData";

function EventForm() {
  const [image, setImage] = useState("")
  const [change, setChange] = useState(false)
  const { user } = useAuth0()
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    "_fields": [
      {
        properties: {
        },
      }, {
        properties: {
          nickname: user.nickname,
        },
      }
    ]
  });

  useEffect(() => {
    apiData.getImage().then((res) => {
      setImage(res.data)
      setFormData({
        "_fields": [
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
  }, [change])

  const [check, setCheck] = useState(false)
  const [error, setError] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [address, setAddress] = useState("");

  const see = (data) => {
    const { eventImage, ...dataWithoutImage } = data;
    const Eventdata = data.eventImage[0] ? data : dataWithoutImage
    if (address != "") {
      setFormData({
        "_fields": [
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
      console.log(formData, data);
    }
  }
  const onSubmit = (data) => {
    if (address != "") {
      see(data)
      setError(false)
      setAddress("")
      reset()
      if (data.eventImage[0] != null) {
        const formData = new FormData();
        formData.append("file", data.eventImage[0]);
        apiData.sendFile(formData).then((res) => {
          dispatch(addEvent({ event: { content: { ...data, address, eventImage: res.data.result }, owner: user.email } }))
        })
      } else {
        console.log({ event: { content: { ...data, address, eventImage: image }, owner: user.email } });
        dispatch(addEvent({ event: { content: { ...data, address, eventImage: image }, owner: user.email } }))

      }
    } else {
      setError(true)
    }
  };

  const handleSelect = (selectedAddress) => {
    setAddress(selectedAddress);
    setError(false)
  };

  const handleChange = (newAddress) => {
    setAddress(newAddress);
    setError(false)
  };
  const checkboxChange = () => {
    setCheck(!check)
  }

  return (
    <Box>
      <Typography
        variant="h1"
        fontWeight="500"
        className={style.Typography_home}
        sx={{
          fontSize: ["xx-large", "xx-large", "xxx-large", "xxx-large"],
          paddingLeft: [0, 0, 3, 0],
        }}
      >
        Utwórz nowe Wydarzenie
      </Typography>
      <Box
        sx={{
          flexDirection: "row",
          display: "flex",
          backgroundColor: "#f5f5f5",
          borderRadius: "20px",
          margin: "20px",

          justifyContent: "space-around",
        }}
      >
        <Box sx={{ marginBottom: "20px", marginLeft: "30px", width: "300px", alignSelf: "center", display: "flex", flexDirection: "column" }}>
          <Event item={formData}></Event>

          <Button onClick={() => { setChange(!change) }}> Zmień obrazek</Button>

          <Button onClick={handleSubmit(see)}> Podgląd</Button>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)} className={style.container}>
          <div className={style.name}>
            <label htmlFor="eventName" >Nazwa Wydarzenia</label>
            <input type="text" id="eventName" {...register("eventName", { required: true })} />
            {errors.eventName && <span>Pole Wymagane</span>}
          </div>
          <div className={style.TimeDate}>
            <div className={style.time}>
              <label htmlFor="eventTime">Czas rozpoczęcia</label>
              <input type="time" id="eventTime" {...register("eventTime", { required: true })} />
              {errors.eventTime && <span>Pole Wymagane</span>}
            </div>
            <div className={style.date}>
              <label htmlFor="eventDate">Data wydarzenia</label>
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                id="eventDate"
                {...register("eventDate", { required: true })}
              />
              {errors.eventDate && <span>Pole Wymagane</span>}
            </div>
          </div>

          <div className={style.loc}>
            <label htmlFor="eventLocation">Lokalizacja</label>
            <PlacesAutocomplete value={address} onChange={handleChange} onSelect={handleSelect}>
              {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <div>
                  <input {...getInputProps({ placeholder: "Type address" })} />
                  <div style={{ backgroundColor: "white", borderRadius: "20px", margin: "0" }}>
                    {loading ? <div>Loading...</div> : null}

                    {suggestions.map((suggestion) => {
                      const style = {
                        textDecoration: suggestion.active ? "underline #0000ff" : "none",
                        fontSize: suggestion.active ? "15px" : "12px",
                        marginTop: "4px",
                      };
                      return (
                        <div className={style.LocDiv} {...getSuggestionItemProps(suggestion, { style })}>
                          {suggestion.description}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </PlacesAutocomplete>
            {error && <span>Pole Wymagane</span>}
          </div>

          <div className={style.photo}>
            <label htmlFor="eventImage">Zdjęcie</label>
            <input type="file" accept=".png, .jpg, .jpeg" id="eventImage" {...register("eventImage")} />
          </div>

          <div className={style.desc}>
            <label htmlFor="eventDescription">Opis wydarzenia</label>
            <textarea id="eventDescription" {...register("eventDescription")} />
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <label style={{ alignContent: "center" }}>Ograniczona Ilość miejsc:</label>
            <Checkbox onChange={() => { checkboxChange() }}></Checkbox>
          </div>
          {check && <div className={style.desc}>
            <label htmlFor="seat">Liczba miejsc</label>
            <input id="seat" type="number" min="1" {...register("seat")} />
          </div>}
          <Button type="submit">Dodaj</Button>

        </form>
      </Box>
    </Box>
  );
}

export default EventForm;
