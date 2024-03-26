import "./App.css";
import { RouterProvider } from "react-router-dom";
import AppRouter from "./router.js";
import React from "react";

function App() {
  return (
    <div className="App">
      <RouterProvider router={AppRouter} />
    </div>
  );
}

export default App;
