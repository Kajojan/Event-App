import React from "react";
import Header from "../../components/Header/Header";
import CurrentEvent from "../../components/Events/CurrentEvent";

const CurrentEventView = () => {
  return (
    <div>
      <Header></Header>
      <CurrentEvent />
    </div>
  );
};

export default CurrentEventView;
