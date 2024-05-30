const express = require("express");
const router = express.Router();

const { create_user, get_user } = require("../db/models/user");

router.post("/register", async (req, res) => {
  try {
    const { name, email, picture, nickname } = req.body;
    const user = await create_user(name, email, picture, nickname);
    if (user.isSuccessful) {
      res.status(201).send({ user: user.user });
    } else {
      res.status(400).send(user.message);
    }
  } catch (error) {
    console.dir(error);
    res.status(400).send(user.message);
  }
});

module.exports = router;
