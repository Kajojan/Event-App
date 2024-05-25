import "./App.css";
import { RouterProvider, useNavigate } from "react-router-dom";
import AppRouter from "./router.js";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { connect } from "./store/slices/socketSlice.js";
import { useAuth0 } from "@auth0/auth0-react";

function App() {
  const { user, isAuthenticated } = useAuth0();

  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(connect({ user }));
    }
  }, [isAuthenticated]);

  return (
    <div className="App">
      <RouterProvider router={AppRouter} />
    </div>
  );
}

export default App;
