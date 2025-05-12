const { runQuery } = require('../db_connect')

const functions = {
  check_is_relation_event_user: async function (username, eventID, relation_name) {
    try {
      const res = await runQuery(
        `MATCH (u1:user {email: '${username}'}) -[r:${relation_name}] -> (u2:event) WHERE id(u2)=${eventID} RETURN r `
      )
      return res.records.length == 0
    } catch (error) {
      console.log(error)
    }
  },
  create_relation_event_user: async function (username, eventID, relation_name, data = '') {
    try {
      if (await this.check_is_relation_event_user(username, eventID, relation_name)) {
        await runQuery(
          `MATCH (u1:user {email: '${username}'}), (u2:event) WHERE id(u2)=${eventID} CREATE (u1)-[:${relation_name} {seat: "${data}" } ]->(u2) RETURN u2 `
        )
        return { isSuccessful: true }
      } else {
        return { message: 'relation exists', isSuccessful: false }
      }
    } catch (error) {
      console.log(error)
    }
  },
  find_all_follow: async function (username) {
    try {
      const res = await runQuery(`MATCH (n: user {email: '${username}' })- [r:PART] -> (m:event) RETURN m,r`)
      return { isSuccessful: true, data: res.records }
    } catch (error) {
      console.log(error)
    }
  },
  add_revie: async function (email, eventID, star, content) {
    try {
      if (await this.check_is_relation_event_user(email, eventID, 'REVIE')) {
        await runQuery(
          `MATCH (u1:user {email: '${email}'}), (u2:event) WHERE id(u2)=${eventID} CREATE (u1)-[:REVIE {star: "${star}", content: "${content}"} ]->(u2) RETURN u2 `
        )
        return { isSuccessful: true }
      } else {
        return { message: 'relation exists', isSuccessful: false }
      }
    } catch (error) {
      console.log(error)
    }
  },
  find_revied: async function (email, eventID) {
    try {
      const res = await runQuery(`MATCH (n: user {email: '${email}' })- [r:REVIE] -> (m:event)  WHERE id(m)=${eventID} RETURN m,r`)
      return res.length > 0 ? { isSuccessful: true, data: res.records } : { isSuccessful: false }
    } catch (error) {
      console.log(error)
    }
  },
  find_all_revied: async function (email) {
    try {
      const res = await runQuery(`
        MATCH (n: user {email: '${email}' })- [r:PART] -> (m:event)  
        WHERE NOT (n)-[:REVIE]->(m) 
        AND datetime({
          date: date(coalesce(m.eventDate, '1970-01-01')),
          time: time({
            hour: toInteger(split(coalesce(m.eventTime, '00:00'), ':')[0]),
            minute: toInteger(split(coalesce(m.eventTime, '00:00'), ':')[1])
          }),
          timezone: 'Europe/Warsaw'
        }) < datetime({timezone: 'Europe/Warsaw'})
      WITH m
      OPTIONAL MATCH (m) <-[:OWNER]- (owner:user)
      OPTIONAL MATCH (owner)-[:OWNER]->(:event)<-[r2:REVIE]-()
      WITH m,owner,avg(toInteger(r2.star)) AS averageRating, COUNT(DISTINCT r2) AS reviewCount
      RETURN m, owner, null, averageRating, reviewCount
        `)
      return { isSuccessful: true, data: res.records }
    } catch (error) {
      console.log(error)

    }
  }


}

module.exports = functions
