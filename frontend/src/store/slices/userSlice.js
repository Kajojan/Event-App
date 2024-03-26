import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: null,
  name: null,
  lastname: null,
  email: null,
};

const userSlice = createSlice({
  name: "yourSlice",
  initialState,
  reducers: {
    
  },
});

export const { yourAction } = userSlice.actions;
export default userSlice.reducer;
