const express = require("express");
const router = express.Router();
const { get_user, get_all, edit_profile, get_relations_count } = require("../db/models/user");
const relation = require("../db/models/relations");

router.get("/:username", async (req, res) => {
  const username = req.params.username;
  try {
    const resoult = await get_user(username);
    res.status(200).send(resoult);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.put("/change", async (req, res) => {
  const { email, data } = req.body;
  try {
    const resoult = await edit_profile(email, data);
    res.send(resoult);
  } catch (error) {
    console.log(error);
  }
});

router.get("/stats/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const resoutl = await get_relations_count(email);
    res.status(200).send(resoutl);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
