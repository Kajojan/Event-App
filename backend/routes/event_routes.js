const express = require("express");
const router = express.Router();
const { get_comment, getAllevent, edit_event, get_event: get_event } = require("../db/models/event");
const relation = require("../db/models/relations");

router.event("/edit_event", async (req, res) => {
  const data = req.body;
  try {
    const event = await edit_event(data.id, data.content);
    res.status(200).send(event);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/get_event/:id", async (req, res) => {
  const eventId = req.params.id;
  try {
    const event = await get_event(eventId);
    res.status(200).send(event);
  } catch (error) {
    res.status(500).send(error.message);
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

router.event("/like", async (req, res) => {
  const { username, id } = req.body;

  try {
    const resoult = await relation.create_relation_event_user(username, id, "LIKE");
    if (resoult.isSuccessful) {
      res.status(200).send(resoult);
    } else {
      res.status(409);
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.event("/view", async (req, res) => {
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
