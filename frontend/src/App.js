import "./App.css";
import { RouterProvider, useNavigate } from "react-router-dom";
import AppRouter from "./router.js";
import React, { useEffect } from "react";

function App() {
  return (
    <div className="App">
      <RouterProvider router={AppRouter} />
    </div>
  );
}

export default App;
