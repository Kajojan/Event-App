import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  socket: null,
};

const socketSlice = createSlice({
  name: "yourSlice",
  initialState,
  reducers: {},
});

export const { yourAction } = socketSlice.actions;
export default socketSlice.reducer;
