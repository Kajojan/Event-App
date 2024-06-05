const express = require("express");
const router = express.Router();
const {
  get_comment,
  getAllevent,
  getEventByName,
  edit_event,
  TakePart_event_seat_counter,
  get_event: get_event,
  delete_event,
} = require("../db/models/event");
const relation = require("../db/models/relations");

router.post("/edit_event", async (req, res) => {
  const data = req.body;
  try {
    const event = await edit_event(data.id, data.content);
    res.status(200).send(event);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/get_event/:id/:email", async (req, res) => {
  const eventId = req.params.id;
  const email = req.params.email;
  try {
    const event = await get_event(eventId, email);
    res.status(200).send(event);
  } catch (error) {
    res.status(500).send(error.message);
  }
});



router.put("/edit/", async (req, res) => {
    const { id, data } = req.body;
  try {
    const event = await edit_event(id, data);
    res.status(200).send(event);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
router.delete("/:id", async(req,res)=>{
  const id = req.params.id
  try {
    const status = await delete_event(id);
    res.status(200).send(status);
  } catch (error) {
    res.send(500).send(error);
  }
})

router.get("/getByName/:name", async (req, res) => {
  const name = req.params.name;
  try {
    const findEvents = await getEventByName(name);
    res.status(200).send(findEvents);
  } catch (error) {
    res.send(500).send(error);
  }
});

router.get("/comments/:id", async (req, res) => {
  const eventId = req.params.id;
  try {
    const event = await get_comment(eventId);
    res.status(200).send(event);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/getAllevents/:username", async (req, res) => {
  const username = req.params.username;

  try {
    const eventFollow = await getAllevent(username);
    const events = eventFollow.event;
    events.sort((a, b) => b._fields[0].identity.low - a._fields[0].identity.low);
    res.status(200).send(events);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post("/takePart", async (req, res) => {
  const { email, id } = req.body;
  try {
    const istakpart = await TakePart_event_seat_counter(id);
    if (istakpart.isSuccessful) {
      const resoult = await relation.create_relation_event_user(
        email,
        id,
        "PART",
        istakpart?.event[0]?._fields[0]?.properties?.seat?.low + 1 || "wstęp wolny"
      );

      if (resoult.isSuccessful) {
        res.status(200).send(resoult);
      } else {
        res.status(409);
      }
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post("/view", async (req, res) => {
  const { username, id } = req.body;

  try {
    const resoult = await relation.create_relation_event_user(username, id, "VIEW");
    if (resoult.isSuccessful) {
      res.status(200).send(resoult);
    } else {
      res.status(409);
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get("/relation/:idQuote/:relationName", async (req, res) => {
  const { idQuote, relationName } = req.params;

  try {
    const resoult = await relation.check_is_QUOTE(idQuote, relationName);
    if (resoult.records.length > 0) {
      res
        .status(200)
        .send({ event: resoult.records[0].get("u2"), user: resoult.records[0].get("u"), isSuccessful: true });
    } else {
      res.status(200).send({ isSuccessful: false });
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
