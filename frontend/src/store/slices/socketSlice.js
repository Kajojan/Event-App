import { createSlice } from '@reduxjs/toolkit'
import io from 'socket.io-client'
const auth0CacheKey = `@@auth0spajs@@::${process.env.REACT_APP_CLIENT_ID}::${process.env.REACT_APP_AUDIENCE}::openid profile email offline_access`
const auth0Cache2 = JSON.parse(localStorage.getItem(auth0CacheKey))
const auth0Cache = auth0Cache2?.body?.access_token
const initialState = {
  socket: null,
  notification: [],
  isNotification: 0,
  revie:[],
}

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    IntNotification(state, action) {
      state.isNotification = action.payload
    },
    Notification(state, action) {
      state.notification = [...state.notification, action.payload]
      state.isNotification = state.isNotification + 1
    },
    AddRevie(state, action) {
      state.revie = [...state.revie, action.payload]
      state.isNotification = state.isNotification + 1

    },
    DelRevie(state, action) {
      state.revie = state.revie.filter(el=>el[0].identity.low != action.payload.identity.low)
      state.isNotification = state.isNotification - 1
    },
    connect(state, action) {
      const { email, name, nickname } = action.payload.user
      const socket = io(`${process.env.REACT_APP_API_URL}/connect`, {
        auth: { token: auth0Cache },
        query: { email, name, nickname },
      })

      state.socket = socket
    },

    addEvent(state, action) {
      if (state.socket) {
        state.socket.emit('addEvent', action.payload.event)
      }
    },
    getEvents(state, action) {
      if (state.socket) {
        state.socket.emit('get_new_event', action.payload)
      }
    },
  },
})

export const { connect, addEvent, getEvents, IntNotification, Notification, AddRevie, DelRevie } = socketSlice.actions
export default socketSlice.reducer
