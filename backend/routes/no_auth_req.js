const express = require("express");
const router = express.Router();

const {
  get_newEvents_yourComing,
  get_newEvents_coming,
  get_newEvents_recommended,
  get_newEvents_popular,
} = require("../db/models/event");

router.get("/:name/get_event/:email", async (req, res) => {
  const name = req.params.name;
  console.log(name);
  const email = req.params.email;
  skip = 0;
  try {
    switch (name) {
      case "popular":
        const newEventPopular = await get_newEvents_popular(skip);
        res.status(200).send(newEventPopular);

        break;
      case "yourincomming":
        const newEvent_yourCOming = await get_newEvents_yourComing(email, skip);
        res.status(200).send(newEvent_yourCOming);
        break;

      case "incomming":
        const newEvent_inComing = await get_newEvents_coming(skip);
        res.status(200).send(newEvent_inComing);
        break;

      case "recommended":
        const newEvent_rem = await get_newEvents_recommended(email, skip);
        res.status(200).send(newEvent_rem);
        break;
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
