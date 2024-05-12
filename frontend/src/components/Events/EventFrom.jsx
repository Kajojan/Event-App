import React, { useState } from "react";
import { useForm } from "react-hook-form";
import style from "./EventForm.module.scss";
import { Box, Typography } from "@mui/material";
import Event from "./Event";
import PlacesAutocomplete from "react-places-autocomplete";

function EventForm() {
  const [formData, setFormData] = useState({});
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    setFormData(data);
    console.log({ ...data, address });
  };
  const [address, setAddress] = useState("");

  const handleSelect = (selectedAddress) => {
    setAddress(selectedAddress);
  };

  const handleChange = (newAddress) => {
    setAddress(newAddress);
  };

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
        <Box sx={{ marginBottom: "20px", marginLeft: "30px", width: "300px", alignItems: "center", display: "flex" }}>
          <Event item={formData}></Event>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)} className={style.container}>
          <div className={style.name}>
            <label htmlFor="eventName">Nazwa Wydarzenia</label>
            <input type="text" id="eventName" {...register("eventName", { required: true })} />
            {errors.eventName && <span>This field is required</span>}
          </div>
          <div className={style.TimeDate}>
            <div className={style.time}>
              <label htmlFor="eventTime">Czas rozpoczęcia</label>
              <input type="time" id="eventTime" {...register("eventTime", { required: true })} />
              {errors.eventTime && <span>This field is required</span>}
            </div>
            <div className={style.date}>
              <label htmlFor="eventDate">Data wydarzenia</label>
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                id="eventTime"
                {...register("eventTime", { required: true })}
              />
              {errors.eventTime && <span>This field is required</span>}
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
            {errors.eventLocation && <span>This field is required</span>}
          </div>

          <div className={style.photo}>
            <label htmlFor="eventImage">Zdjęcie</label>
            <input type="file" id="eventImage" {...register("eventImage")} />
          </div>

          <div className={style.desc}>
            <label htmlFor="eventDescription">Opis wydarzenia</label>
            <textarea id="eventDescription" {...register("eventDescription")} />
          </div>

          <button type="submit">Zapisz</button>
        </form>
      </Box>
    </Box>
  );
}

export default EventForm;
