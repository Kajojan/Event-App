import { configureStore } from "@reduxjs/toolkit";
import socketReducer from "./slices/socketSlice";

const store = configureStore({
  reducer: {
    socket: socketReducer,
  },
});

export default store;
