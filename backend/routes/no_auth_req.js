const express = require('express')
const router = express.Router()

const {
  get_newEvents_yourComing,
  get_newEvents_coming,
  get_newEvents_recommended,
  get_newEvents_popular,
} = require('../db/models/event')
const { get_filters, get_filters_arg, get_filters_events } = require('../db/models/filters')

router.get('/:name/get_event/:email', async (req, res) => {
  const name = req.params.name
  const email = req.params.email
  const skip = 0
  try {
    switch (name) {
    case 'popular': {
      const newEventPopular = await get_newEvents_popular(skip)
      res.status(200).send(newEventPopular)
    }

      break
    case 'yourincomming': {
      const newEvent_yourCOming = await get_newEvents_yourComing(email, skip)
      res.status(200).send(newEvent_yourCOming)
      break
    }

    case 'incomming': {
      const newEvent_inComing = await get_newEvents_coming(skip)
      res.status(200).send(newEvent_inComing)
      break
    }

    case 'recommended': {
      const newEvent_rem = await get_newEvents_recommended(email, skip)
      res.status(200).send(newEvent_rem)
      break
    }
    }
  } catch (error) {
    res.status(500).send(error.message)
  }
})

router.get('/filters', async (_req, res) => {
  try {
    const result = await get_filters()
    res.status(200).send(result)
  } catch (error) {
    res.status(500).send(error.message)

  }

})

router.post('/filters/arg', async (req, res) => {
  try {
    const result = await get_filters_arg(req.body)
    res.status(200).send(result)
  } catch (error) {
    console.log('error events massage', error.message)

    res.status(500).send(error.message)

  }

})

router.post('/filters/events', async (req, res) => {
  try {
    const result = await get_filters_events(req.body)
    res.status(200).send(result.records)
  } catch (error) {
    console.log(error.message)

    res.status(500).send(error.message)

  }

})

module.exports = router
