const { runQuery } = require("../db_connect");

const functions = {
  check_is_relation: async function (follower_username, followee_username, relation_name) {
    try {
      const res = await runQuery(
        `MATCH (u1:user {username: '${follower_username}'}) -[r:${relation_name}] -> (u2:user {username: '${followee_username}'}) RETURN r `
      );
      // console.log(res.records[0]._fields);
      return res.records.length == 0;
    } catch (error) {
      console.log(error);
    }
  },
  find_last_event: async function (username) {
    try {
      const res = await runQuery(
        `MATCH (n: user {username: '${username}' })- [:OWNER] -> (m:event) RETURN MAX(id(m));`
      );
      try {
        last_event = res.records[0].get("MAX(id(m))");
      } catch {
        last_event = 0;
      }
      return last_event;
    } catch (error) {
      console.log(error);
    }
  },

  create_relation_between_users: async function (follower_username, followee_username, relation_name) {
    try {
      if (await this.check_is_relation(follower_username, followee_username, relation_name)) {
        if (relation_name == "FOLLOW") {
          const last = await this.find_last_event(followee_username);
          const res = await runQuery(
            `MATCH (u1:user {username: '${follower_username}'}), (u2:user {username: '${followee_username}'}) CREATE (u1)-[:${relation_name} {first: ${last} }]->(u2) `
          );
        } else {
          const res = await runQuery(
            `MATCH (u1:user {username: '${follower_username}'}), (u2:user {username: '${followee_username}'}) CREATE (u1)-[:${relation_name}]->(u2) `
          );
        }
        return { isSuccessful: true };
      } else {
        return { message: "relation exists", isSuccessful: false };
      }
    } catch (error) {
      console.log(error);
    }
  },

  check_is_relation_event_user: async function (username, eventID, relation_name) {
    try {
      const res = await runQuery(
        `MATCH (u1:user {name: '${username}'}) -[r:${relation_name}] -> (u2:event) WHERE id(u2)=${eventID} RETURN r `
      );
      return res.records.length == 0;
    } catch (error) {
      console.log(error);
    }
  },

  create_relation_event_user: async function (username, eventID, relation_name) {
    try {
      if (await this.check_is_relation_event_user(username, eventID, relation_name)) {
        const res = await runQuery(
          `MATCH (u1:user {email: '${username}'}), (u2:event) WHERE id(u2)=${eventID} CREATE (u1)-[:${relation_name}]->(u2) RETURN u2 `
        );
        return { isSuccessful: true };
      } else {
        return { message: "relation exists", isSuccessful: false };
      }
    } catch (error) {
      console.log(error);
    }
  },

  delete_realtion: async function (follower_username, followee_username, relation_name) {
    try {
      if (!(await this.check_is_relation(follower_username, followee_username, relation_name))) {
        const res = await runQuery(
          `MATCH (u1:user {username: '${follower_username}'}) -[r:${relation_name}] -> (u2:user {username: '${followee_username}'}) DELETE r `
        );
        return { isSuccessful: true };
      } else {
        return { message: "relation not exists", isSuccessful: false };
      }
    } catch (error) {
      console.log(error);
    }
  },

  find_all_follow: async function (username) {
    try {
      const res = await runQuery(`MATCH (n: user {email: '${username}' })- [r:FOLLOW] -> (m:user) RETURN m,r`);
      return { isSuccessful: true, data: res.records };
    } catch (error) {
      console.log(error);
    }
  },

  find_all_events: async function (username) {
    try {
      const res = await runQuery(`MATCH (n: user {username: '${username}' })- [:OWNER] -> (m:event) RETURN id(m)`);
      arrayOfId = res.records.map((a) => a.get("id(m)"));
      return { isSuccessful: true, data: arrayOfId };
    } catch (error) {
      console.log(error);
    }
  },

  check_is_relation_events: async function (eventId, idRelatedTo, relation_name) {
    try {
      const res = await runQuery(
        `MATCH (u1:event) -[r:${relation_name}] -> (u2:event) WHERE id(u1)=${eventId} AND id(u2)=${idRelatedTo} RETURN r `
      );
      return res.records.length == 0;
    } catch (error) {
      console.log(error);
    }
  },

  create_relation_between_events: async function (comment_id, event_id, relation_name) {
    try {
      if (this.check_is_relation_events(comment_id, event_id, relation_name)) {
        const res = await runQuery(
          `MATCH (u1:event), (u2:event) WHERE id(u2)=${event_id}  AND id(u1)=${comment_id}    CREATE (u1)-[:${relation_name}]->(u2) `
        );
        return { isSuccessful: true };
      } else {
        return { isSuccessful: false };
      }
    } catch (error) {
      console.log(error);
    }
  },

  check_is_QUOTE: async function (eventId, relation_name) {
    try {
      const res = await runQuery(
        `MATCH (u1:event) -[r:${relation_name}] -> (u2:event) <- [:OWNER] -(u:user) WHERE id(u1)=${eventId}  RETURN u2, u`
      );
      return res;
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = functions;
