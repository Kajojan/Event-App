import { createSlice } from "@reduxjs/toolkit";
import io from "socket.io-client";
const auth0CacheKey = `@@auth0spajs@@::${process.env.REACT_APP_CLIENT_ID}::${process.env.REACT_APP_AUDIENCE}::openid profile email offline_access`;
const auth0Cache2 = JSON.parse(localStorage.getItem(auth0CacheKey));
const auth0Cache = auth0Cache2?.body?.access_token;
const initialState = {
  socket: null,
  yourIncommingEvent: null,
  popular: [],
  recomended: [],
  incomming: [],
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    connect(state, action) {
      const { email, name, nickname } = action.payload.user;
      state.socket = io("https://localhost:4000/connect", {
        auth: { token: auth0Cache },
        query: { email, name, nickname },
      });
    },
    addEvent(state, action) {
      if (state.socket) {
        state.socket.emit("addEvent", action.payload.event);
      }
      // state.socket.on("addEvent", (resData) => {
      // const postId = resData.post[0]._fields[0].identity.low;
      // this.socket.on(`event-${postId}`, (data) => {
      //   const data2 = { message: "New Comment in your post ", postId: postId };
      //   this.notification?.unshift(data2);
      //   this.isNotification == null ? (this.isNotification = 1) : (this.isNotification += 1);
      // });
      // });
    },
    getEvents(state, action) {
      if (state.socket) {
        state.socket.emit("get_new_event", action.payload);
      }
    },
  },
});

export const { connect, addEvent, getEvents } = socketSlice.actions;
export default socketSlice.reducer;
