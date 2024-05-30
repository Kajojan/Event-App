import "./App.css";
import { RouterProvider, useNavigate } from "react-router-dom";
import AppRouter from "./router.js";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Notification, IntNotification } from "./store/slices/socketSlice.js";

function App() {
  const socket = useSelector((state) => state.socket.socket);
  const dispatch = useDispatch();
  const notifi = useSelector((state) => state.socket.isNotification);
  useEffect(() => {
    if (socket || socket?.connected) {
      socket.on("Powiadomienie", (data) => {
        console.log(data);
        dispatch(Notification(data));
        dispatch(IntNotification(notifi + 1));
      });
    }
  }, [socket]);
  return (
    <div className="App">
      <RouterProvider router={AppRouter} />
    </div>
  );
}

export default App;
