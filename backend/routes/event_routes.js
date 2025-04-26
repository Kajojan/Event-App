const express = require('express')
const router = express.Router()
const {
  getEventByName,
  edit_event,
  TakePart_event_seat_counter,
  get_event: get_event,
  delete_event,
} = require('../db/models/event')
const relation = require('../db/models/relations')

router.get('/get_event/:id/:email', async (req, res) => {
  const eventId = req.params.id
  const email = req.params.email
  try {
    const event = await get_event(eventId, email)
    res.status(200).send(event)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

router.put('/edit', async (req, res) => {
  const { id, data } = req.body
  try {
    const event = await edit_event(id, data)
    res.status(200).send(event)
  } catch (error) {
    res.status(500).send(error.message)
  }
})
router.delete('/:id', async (req, res) => {
  const id = req.params.id
  try {
    const status = await delete_event(id)
    res.status(200).send(status)
  } catch (error) {
    res.send(500).send(error)
  }
})

router.get('/getByName/:name', async (req, res) => {
  const name = req.params.name
  try {
    const findEvents = await getEventByName(name)
    res.status(200).send(findEvents)
  } catch (error) {
    res.send(500).send(error)
  }
})

router.post('/takePart', async (req, res) => {
  const { email, id } = req.body
  try {
    const istakpart = await TakePart_event_seat_counter(id)
    if (istakpart.isSuccessful) {
      const resoult = await relation.create_relation_event_user(
        email,
        id,
        'PART',
        parseInt(istakpart?.event[0]?._fields[0]?.properties?.seat) + 1 || 'wstęp wolny'
      )

      if (resoult.isSuccessful) {
        res.status(200).send(resoult)
      } else {
        res.status(409)
      }
    }
  } catch (err) {
    res.status(500).send(err.message)
  }
})


module.exports = router
