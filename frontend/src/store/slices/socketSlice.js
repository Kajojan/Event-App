import { createSlice } from "@reduxjs/toolkit";
import io from "socket.io-client";
const auth0CacheKey = `@@auth0spajs@@::${process.env.REACT_APP_CLIENT_ID}::${process.env.REACT_APP_AUDIENCE}::openid profile email offline_access`;
const auth0Cache2 = JSON.parse(localStorage.getItem(auth0CacheKey));
const auth0Cache = auth0Cache2?.body?.access_token;
const initialState = {
  socket: null,
  notification: [],
  isNotification: 0,
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    IntNotification(state, action) {
      state.isNotification = action.payload;
      console.log(state.isNotification);
    },
    Notification(state, action) {
      state.notification = [...state.notification, action.payload];
      state.isNotification = state.isNotification + 1;
      console.log(state.isNotification);
    },
    connect(state, action) {
      console.log("connect: ");
      const { email, name, nickname } = action.payload.user;
      const socket = io("https://localhost:4000/connect", {
        auth: { token: auth0Cache },
        query: { email, name, nickname },
      });

      state.socket = socket;
    },

    addEvent(state, action) {
      if (state.socket) {
        state.socket.emit("addEvent", action.payload.event);
      }
    },
    getEvents(state, action) {
      if (state.socket) {
        state.socket.emit("get_new_event", action.payload);
      }
    },
  },
});

export const { connect, addEvent, getEvents, IntNotification, Notification } = socketSlice.actions;
export default socketSlice.reducer;
