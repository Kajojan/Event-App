import React from "react";
import Header from "../components/Header/Header";
import EventList from "../components/Events/EventList";

const YourIncommingView = () => {
  return (
    <div>
      <Header></Header>
      <EventList
        events={[
          { el: [], elleme: [] },
          { el: [], elleme: [] },
          { el: [], elleme: [] },
          { el: [], elleme: [] },
          { el: [], elleme: [] },
          { el: [], elleme: [] },
          { el: [], elleme: [] },
          { el: [], elleme: [] },
          { el: [], elleme: [] },
          { el: [], elleme: [] },
          { el: [], elleme: [] },
          { el: [], elleme: [] },
          { el: [], elleme: [] },
          { el: [], elleme: [] },
          { el: [], elleme: [] },
        ]}
        name={"Twoje nadchodzące wydarzenia"}
      ></EventList>
    </div>
  );
};

export default YourIncommingView;
