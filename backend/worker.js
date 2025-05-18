const cron = require('node-cron')
const { sendReminderEmails } = require('./Email/emailReminder')

if (process.env.NODE_ENV !== 'test') {
  cron.schedule('* * * * *', () => {
    sendReminderEmails()
  })
}
