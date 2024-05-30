const { error } = require("neo4j-driver");
const { runQuery } = require("../db_connect");
const relation = require("./relations");

exports.create_event = async function (
  eventName,
  eventDate,
  eventTime,
  eventImage,
  eventDescription,
  address,
  owner,
  seat = 0
) {
  const query =
    " CREATE (n:event {eventName: $eventName, eventDate: $eventDate, eventTime: $eventTime, eventImage: $eventImage,  eventDescription: $eventDescription, address: $address, seat: $seat}) RETURN n";

  const parameters = {
    eventName: eventName,
    eventDate: eventDate,
    eventTime: eventTime,
    eventImage: eventImage,
    eventDescription: eventDescription,
    address: address,
    seat: seat,
  };
  try {
    return await runQuery(query, parameters)
      .then(async (result) => {
        const id = result.records[0].get("n").identity.low;
        await relation.create_relation_event_user(owner, id, "OWNER");

        return {
          isSuccessful: true,
          event: result.records,
        };
      })
      .catch((error) => {
        console.log(error);
        return { isSuccessful: false };
      });
  } catch (err) {
    return { isSuccessful: false };
  }
};

exports.get_event = async function (id, email) {
  const query = `MATCH (m:event)- [:OWNER] - (n: user)  WHERE id(m)=${id} 
                  OPTIONAL MATCH (m) <- [:PART] - (l:user) 
                  WITH m, n,COLLECT(l) AS PART
                  OPTIONAL MATCH (m)<-[r:PART]-(c: user {email: "${email}"}) 
                  with m,n,PART,c,r
                  RETURN  m, n , PART,c,r `;
  try {
    return await runQuery(query)
      .then((result) => {
        return {
          isSuccessful: true,
          event: result.records,
        };
      })
      .catch((error) => {
        console.log(error);
        return { isSuccessful: false };
      });
  } catch (err) {
    console.log(err);
    return { isSuccessful: false };
  }
};

exports.get_comment = async function (id) {
  const query = `MATCH (m:event)  <-[:COMMENT]-(n:event) WHERE id(m)=${id} 
                  OPTIONAL MATCH (n) <- [:LIKE] - (l:user) 
                  WITH m, n, l ,COLLECT(l) AS likes_count

                  OPTIONAL MATCH (n)<-[:COMMENT]-(c:event) 

                  OPTIONAL MATCH (n)-[:OWNER]-(u:user) 
                 
                  OPTIONAL MATCH (n) <-[:QUOTE] - (q:event)  
                  WITH m, n,u ,l ,c,likes_count,q,COLLECT(q) AS quote_count

                  OPTIONAL MATCH (n) -[:VIEW] - (v:user)
                  WITH n, u, l ,c,likes_count,q,COLLECT(v) AS view_count,quote_count

                  RETURN  n, u, COUNT(c) AS comment,  SIZE(likes_count) AS like, SIZE(quote_count) AS quote,SIZE(view_count) AS view`;
  try {
    return await runQuery(query)
      .then((result) => {
        return {
          isSuccessful: true,
          event: result.records,
        };
      })
      .catch((error) => {
        console.log(error);
        return { isSuccessful: false };
      });
  } catch (err) {
    console.log(err);
    return { isSuccessful: false };
  }
};

exports.getAllevent = async function (username) {
  const query = `MATCH (m:event) <-[:OWNER] - (n: user {username: '${username}'}) 
                  OPTIONAL MATCH (m) <- [:LIKE] - (l:user) 
                  WITH m, n, l ,COLLECT(l) AS likes_count

                  WHERE NOT EXISTS((m)-[:COMMENT]->(:event))
                  OPTIONAL MATCH (m)<-[:COMMENT]-(c:event) 

                  OPTIONAL MATCH (m) <-[:QUOTE] - (q:event)  
                  WITH m, n, l ,c,likes_count,q,COLLECT(q) AS quote_count

                  OPTIONAL MATCH (m) -[:VIEW] - (v:user)  
                  WITH m, n, l ,c,likes_count,q,COLLECT(v) AS view_count,quote_count

                  OPTIONAL MATCH (m) -[:QUOTE] -> (u2:event) <- [:OWNER] -(u:user)
                  WITH m, n, l ,c,likes_count,q,view_count,quote_count, u2 , u

                  RETURN  m, n, COUNT(c) AS comment, SIZE(likes_count) AS like,  SIZE(quote_count) AS quote, SIZE(view_count) AS view, u2 AS QUOTE, u as QUOTEUSER`;
  try {
    return await runQuery(query)
      .then((result) => {
        return {
          isSuccessful: true,
          event: result.records,
        };
      })
      .catch((error) => {
        console.log(error);
        return { isSuccessful: false };
      });
  } catch (err) {
    return { isSuccessful: false };
  }
};
exports.TakePart_event_seat_counter = async function (id) {
  const query = `MATCH (n:event) WHERE id(n)=${id} and toInteger(n.seat) >0
  SET n.seat = toInteger(n.seat) - 1 
  RETURN n`;
  try {
    return await runQuery(query)
      .then((result) => {
        return {
          isSuccessful: true,
          event: result.records,
        };
      })
      .catch((error) => {
        console.log(error);
        return { isSuccessful: false };
      });
  } catch (err) {
    return { isSuccessful: false };
  }
};

// exports.edit_event = async function (id, content) {
//   const query = `MATCH (m:event) WHERE id(m)=${id} SET m.content='${content}' RETURN m`;
//   try {
//     return await runQuery(query)
//       .then((result) => {
//         return result.records.length == 0
//           ? {
//               isSuccessful: false,
//               message: "event not found",
//             }
//           : {
//               isSuccessful: true,
//               event: result.records[0].get("m"),
//             };
//       })
//       .catch((error) => {
//         console.log(error);
//         return { isSuccessful: false };
//       });
//   } catch (err) {
//     console.log(err);
//     return { isSuccessful: false };
//   }
// };

exports.get_newEvents_yourComing = async function (user, skip) {
  const query = `MATCH (:user {email: "${user}"}) - [r:OWNER] -> (m:event)
                  OPTIONAL MATCH (m) <- [:PART] - (l:user) 
                  OPTIONAL MATCH (m) <- [:OWNER] - (n:user) 
                  WITH m,n ,COLLECT(l) AS PART
                  ORDER BY m.eventDate, m.eventTime
                  skip ${skip}
                  LIMIT 5
                  RETURN m,n, PART`;
  try {
    return await runQuery(query)
      .then((result) => {
        return result.records;
      })
      .catch((error) => {
        console.log(error);
        return { isSuccessful: false };
      });
  } catch (err) {
    console.log(err);
    return { isSuccessful: false };
  }
};

exports.get_newEvents_popular = async function (skip) {
  const query = `MATCH (n: event )  
                  OPTIONAL MATCH (n) <- [:OWNER] - (m:user) 
                  OPTIONAL MATCH (n) <- [:PART] - (l:user) 
                  WITH n,m ,COLLECT(l) AS PART
                  ORDER BY PART DESC
                  SKIP ${skip}
                  LIMIT 5
                  RETURN n,m,PART`;
  try {
    return await runQuery(query)
      .then((result) => {
        return result.records;
      })
      .catch((error) => {
        console.log(error);
        return { isSuccessful: false };
      });
  } catch (err) {
    console.log(err);
    return { isSuccessful: false };
  }
};
exports.get_newEvents_coming = async function (skip) {
  const query = `MATCH (n: event )
                  OPTIONAL MATCH (n) <- [:PART] - (l:user) 
                  OPTIONAL MATCH (n) <- [:OWNER] - (m:user) 
                  WITH n,m ,COLLECT(l) AS PART
                  ORDER BY n.eventDate, n.eventTime
                  SKIP ${skip}
                  LIMIT 5
                  RETURN n,m,PART`;
  try {
    return await runQuery(query)
      .then((result) => {
        return result.records;
      })
      .catch((error) => {
        console.log(error);
        return { isSuccessful: false };
      });
  } catch (err) {
    console.log(err);
    return { isSuccessful: false };
  }
};

// Rkomendacje n jeśli nie ma to wyświetlamy n2 jako " podobne "
exports.get_newEvents_recommended = async function (user, skip) {
  const query = `MATCH (u:user {email: "${user}"}) - [r:PART|OWNER] -> (m:event)
  OPTIONAL MATCH (m) <- [:OWNER|PART] - (l:user)
  OPTIONAL MATCH (n: event) <- [:OWNER|PART] - (l)
  WHERE NOT (u)-[:OWNER|PART]-(n) 
  WITH n,m,COLLECT(l) AS PART,l,u
  ORDER BY n.eventDate, n.eventTime
  OPTIONAL MATCH (n2: event) 
  WHERE NOT (u)-[:OWNER|PART]-(n2) AND NOT (l)-[:OWNER|PART]-(n2)
  WITH n,m,l,n2,PART,u
  SKIP ${skip}
  LIMIT 5 
  RETURN  n,m,n2,l,PART,u `;
  try {
    return await runQuery(query)
      .then((result) => {
        return result.records;
      })
      .catch((error) => {
        console.log(error);
        return { isSuccessful: false };
      });
  } catch (err) {
    console.log(err);
    return { isSuccessful: false };
  }
};
exports.getEventByName = async function (name) {
  const query = `MATCH (e:event)
  WHERE toLower(e.eventName) CONTAINS toLower("${name}")
  RETURN e`;
  try {
    return await runQuery(query)
      .then((result) => {
        console.log(result.records);
        return result.records;
      })
      .catch((error) => {
        console.log(error);
        return { isSuccessful: false };
      });
  } catch (err) {
    console.log(err);
    return { isSuccessful: false };
  }
};

// exports.get_oldevent = async function (user, start) {
//   const query = `MATCH (:user {username: "${user}"}) - [r:FOLLOW] -> (n:user)
//                   OPTIONAL MATCH (m:event) <-[:OWNER] - (n)
//                   OPTIONAL MATCH (m) <- [:LIKE] - (l:user)
//                   WITH m, n, l,r ,COLLECT(l) AS likes_count

//                   WHERE NOT EXISTS((m)-[:COMMENT]->(:event))
//                   OPTIONAL MATCH (m)<-[:COMMENT]-(c:event)

//                   OPTIONAL MATCH (m) <-[:QUOTE] - (q:event)
//                   WITH m, n, l,r ,c,likes_count,q,COLLECT(q) AS quote_count

//                   OPTIONAL MATCH (m) -[:VIEW] - (v:user)
//                   WITH m, n, l,r ,c,likes_count,q,COLLECT(v) AS view_count,quote_count

//                   OPTIONAL MATCH (m) -[:QUOTE] -> (u2:event) <- [:OWNER] -(u:user)
//                   WITH m, n, l,r ,c,likes_count,q,view_count,quote_count, u2 , u

//                   WHERE id(m) < ${start} AND id(m) > r.first
//                   RETURN  m, n, COUNT(c) AS comment, SIZE(likes_count) AS like,  SIZE(quote_count) AS quote, SIZE(view_count) AS view, u2 AS QUOTE, u as QUOTEUSER

//                   ORDER BY id(m) DESC
//                   LIMIT 5`;
//   try {
//     return await runQuery(query)
//       .then((result) => {
//         return result.records;
//       })
//       .catch((error) => {
//         console.log(error);
//         return { isSuccessful: false };
//       });
//   } catch (err) {
//     console.log(err);
//     return { isSuccessful: false };
//   }
// };

// exports.get_event_range = async function (user, start, end) {
//   const query = `MATCH (:user {username: "${user}"}) - [r:FOLLOW] -> (n:user)
//                   OPTIONAL MATCH (m:event) <-[:OWNER] - (n)
//                   OPTIONAL MATCH (m) <- [:LIKE] - (l:user)
//                   WITH m, n, l,r ,COLLECT(l) AS likes_count

//                   WHERE NOT EXISTS((m)-[:COMMENT]->(:event))
//                   OPTIONAL MATCH (m)<-[:COMMENT]-(c:event)

//                   OPTIONAL MATCH (m) <-[:QUOTE] - (q:event)
//                   WITH m, n, l,r ,c,likes_count,q,COLLECT(q) AS quote_count

//                   OPTIONAL MATCH (m) -[:VIEW] - (v:user)
//                   WITH m, n, l,r ,c,likes_count,q,COLLECT(v) AS view_count,quote_count

//                   OPTIONAL MATCH (m) -[:QUOTE] -> (u2:event) <- [:OWNER] -(u:user)
//                   WITH m, n, l,r ,c,likes_count,q,view_count,quote_count, u2 , u

//                   WHERE id(m) <= ${start} AND id(m) >= ${end} AND id(m) > r.first
//                   RETURN  m, n, COUNT(c) AS comment, SIZE(likes_count) AS like,  SIZE(quote_count) AS quote, SIZE(view_count) AS view, u2 AS QUOTE, u as QUOTEUSER

//                   ORDER BY id(m) DESC
//                   LIMIT 5`;
//   try {
//     return await runQuery(query)
//       .then((result) => {
//       return result.records;
//       })
//       .catch((error) => {
//         console.log(error);
//         return { isSuccessful: false };
//       });
//   } catch (err) {
//     console.log(err);
//     return { isSuccessful: false };
//   }
// };

// exports.delete_event
