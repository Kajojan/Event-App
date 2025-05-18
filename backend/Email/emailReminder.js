const nodemailer = require('nodemailer')
const { runQuery } = require('../db/db_connect')


const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
})

const sendReminderEmails = async()=> {
  try {
    const query = `
    MATCH (e:event)<-[r:PART]-(u:user)
    WHERE datetime(e.eventDate + "T" + e.eventTime + ":00") >=  datetime() + duration({hours:26})
    AND datetime(e.eventDate + "T" + e.eventTime + ":00") < datetime() + duration({hours:26, minutes:1})
    RETURN e, collect(u.email) as emails
    `

    const result = await runQuery(query)

    for (const record of result.records) {
      const eNode = record.get('e')
      if (!eNode) {
        console.warn('Pominięto rekord bez węzła event')
        continue
      }
      const event = eNode.properties
      const emails = record.get('emails')
      const id = record.get('e').identity.low


      for (const email of emails) {
        await await transporter.sendMail({
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
                        <strong>${event.eventName}</strong> odbędzie się już za 24 godziny.
                      </p>
        
                      <ul>
                        <li><strong>🕒 Godzina:</strong> ${event.eventTime}</li>
                        <li><strong>📍 Miejsce:</strong> ${event.address}</li>
                      </ul>
                      <p>
                        👉 <a href="https://event-app-usy2.onrender.com/event/${id}" style="color: #1a73e8;">
                          Zobacz szczegóły wydarzenia
                        </a>
                      </p>
        
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
        console.log(`Wysłano mail do ${email} o wydarzeniu ${event.eventName}`)
      }

    }
  } catch (err) {
    console.error('Błąd podczas wysyłania maili:', err)
  }
}


module.exports = { sendReminderEmails }


