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
}

module.exports = functions
