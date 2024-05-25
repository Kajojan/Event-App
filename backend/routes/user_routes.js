const express = require("express");
const router = express.Router();
const { get_user, get_all, edit_profile_about } = require("../db/models/user");
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

router.get("/relation/:username/:checkusername/:relationName", async (req, res) => {
  const { username, checkusername, relationName } = req.params;
  try {
    const resoutl = await relation.check_is_relation(username, checkusername, relationName);
    res.status(200).send(resoutl);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/getAll/:username", async (req, res) => {
  const username = req.params.username;
  try {
    const resoult = await get_all(username);
    res.send(resoult);
  } catch (error) {
    console.log(error);
  }
});

router.put("/changeabout", async (req, res) => {
  const { username, about } = req.body;
  try {
    const resoult = await edit_profile_about(username, about);
    res.send(resoult);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
