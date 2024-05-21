import React from "react";
import Header from "../components/Header/Header";
import EventList from "../components/Events/EventList";

const RecomendedView  = () => {
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
        name={"Rekomendowane wydarzenia"}
      ></EventList>
    </div>
  );
};

export default RecomendedView ;
