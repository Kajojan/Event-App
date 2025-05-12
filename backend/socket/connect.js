const {
  create_event,
  get_newEvents_coming,
  get_newEvents_popular,
  get_newEvents_yourComing,
  get_newEvents_recommended,
} = require('../db/models/event')
const relations = require('../db/models/relations')
const { expressjwt: jwt } = require('express-jwt')
const jwksRsa = require('jwks-rsa')
const cron = require('node-cron')
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'event.app.usy2@gmail.com',
    pass: 'jixm ovjo viha bfnw',
  },
})


const jwtCheck = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.Auth_DOMAIN}/.well-known/jwks.json`,
  }),
  audience: process.env.AUDIENCE,
  issuer: `https://${process.env.Auth_DOMAIN}/`,
  algorithms: ['RS256'],
})


module.exports = (io) => {
  const connect = io.of('connect')
  connect.use((socket, next) => {
    const token = socket.handshake.auth.token
    if (!token) {
      return next(new Error('Authentication error'))
    }
    jwtCheck({ headers: { authorization: `Bearer ${token}` } }, {}, (err) => {
      if (err) {
        console.log(err)
        socket.emit('auth_error', { message: 'Token missing' })
      }
      next()
    })
  })
  connect.on('connect', async (socket) => {
    try {
      const { email } = socket.handshake.query
      console.log('# Socket.io: połączono: ', email)

      const [follow_arr, NotReviedEvents] = await Promise.all([relations.find_all_follow(email), relations.find_all_revied(email)])

      follow_arr.data.map(async (element) => {
        const eventDateTime = new Date(
          `${element._fields[0].properties.eventDate}T${element._fields[0].properties.eventTime}`
        )

        const eventDateTimeMinus12Hours = new Date(eventDateTime.getTime() - 24 * 60 * 60 * 1000)
        const month = eventDateTimeMinus12Hours.getMonth() + 1
        const day = eventDateTimeMinus12Hours.getDate()
        const hour = eventDateTimeMinus12Hours.getHours() - 2
        const minute = eventDateTimeMinus12Hours.getMinutes()
        const cronExpression = `${minute} ${hour} ${day} ${month} *`

        cron.schedule(cronExpression, async () => {
          socket.emit('Powiadomienie', element._fields[0])
          await transporter.sendMail({
            from: 'your@gmail.com',
            to: email,
            subject: 'EventApp - Powiadomienie o nadchodzącym wydarzeniu',
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
                <li><strong>📍 Miejsce:</strong> ${element._fields[0].properties.address}</li>
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
        })
      })

      NotReviedEvents.data.map(async (element)=>{
        socket.emit('addRevie', element._fields)
      })

      socket.on('get_new_event', async (data) => {
        const { name, skip, username, type } = data
        console.log(name)

        switch (name) {
        case 'popular': {
          const newEventPopular = await get_newEvents_popular(skip)
          socket.emit('receive_new_event_popular', newEventPopular)
          break
        }

        case 'yourincomming': {
          const newEvent_yourCOming = await get_newEvents_yourComing(username, skip, type)
          socket.emit('receive_new_event_yourComing', newEvent_yourCOming)
          break
        }

        case 'incomming': {
          const newEvent_inComing = await get_newEvents_coming(skip)
          socket.emit('receive_new_event_inComing', newEvent_inComing)
          break
        }

        case 'recommended': {
          const newEvent_rem = await get_newEvents_recommended(username, skip)
          socket.emit('receive_new_event_reco', newEvent_rem)
          break
        }

        default:
          console.log('defoult:, ', data)
          break
        }
      })

      socket.on('addEvent', async (data) => {
        const { eventName, eventTime, eventDate, eventImage, eventDescription, detailAddress, address, seat, arrayType } = data.content
        const res = await create_event(
          eventName,
          eventDate,
          eventTime,
          eventImage,
          eventDescription,
          address,
          detailAddress,
          data.owner,
          seat,
          arrayType
        )
        socket.emit('create_event', res)
      })
      socket.on('disconnect', () => {
        console.log('# Socket.io: rozłączono')
      })

      socket.on('error', (err) => {
        console.dir(err.message)
      })

    } catch (error) {
      console.error('Błąd podczas obsługi połączenia Socket.IO:', error)
    }
  })
}
