const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')

router.post('/', async (req, res) => {
  const { to, subject } = req.body

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'event.app.usy2@gmail.com',
      pass: 'jixm ovjo viha bfnw',
    },
  })

  const element = { _fields:[{ properties:{ eventName:'testWydarzenie', eventTime:'18:20', adress:'adress' } }] }
  await transporter.sendMail({
    from: 'your@gmail.com',
    to,
    subject,
    html:  `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="cid:eventlogo" alt="EventApp Logo" style="max-width: 150px;" />
      </div>

      <p>Cześć,</p>

      <p>
        To tylko przypomnienie, że wydarzenie 
        <strong>${element._fields[0].properties.eventName}</strong> odbędzie się już za 24 godziny.
      </p>

      <ul>
        <li><strong>🕒 Godzina:</strong> ${element._fields[0].properties.eventTime}</li>
        <li><strong>📍 Miejsce:</strong> ${element._fields[0].properties.adress}</li>
      </ul>

      <p>Do zobaczenia!</p>
    </div>
  `,
    attachments: [
      {
        filename: 'eventApp.png',
        path: './Logo.png',
        cid: 'eventlogo',
      },
    ],
  })

  res.sendStatus(200)
})

module.exports = router

