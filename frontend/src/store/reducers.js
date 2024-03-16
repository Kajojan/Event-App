import { combineReducers } from "redux";
import userReducer from "./slices/userSlice";
import socketReducer from "./slices/socketSlice";

const rootReducer = combineReducers({
  userReducer,
  socketReducer,
});

export default rootReducer;
