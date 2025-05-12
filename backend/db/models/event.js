const { runQuery } = require('../db_connect')
const relation = require('./relations')

exports.create_event = async function (
  eventName,
  eventDate,
  eventTime,
  eventImage,
  eventDescription,
  address,
  detailAddress,
  owner,
  seat = 0,
  arrayType
) {
  const query =
    ' CREATE (n:event {eventName: $eventName, eventDate: $eventDate, eventTime: $eventTime, eventImage: $eventImage,  eventDescription: $eventDescription, detailAddress: $detailAddress, address: $address, seat: $seat, eventType: $arrayType}) RETURN n'

  const parameters = {
    eventName: eventName,
    eventDate: eventDate,
    eventTime: eventTime,
    eventImage: eventImage,
    eventDescription: eventDescription,
    address: address,
    detailAddress: detailAddress,
    seat: seat,
    arrayType: arrayType
  }
  try {
    return await runQuery(query, parameters)
      .then(async (result) => {
        const id = result.records[0].get('n').identity.low
        await relation.create_relation_event_user(owner, id, 'OWNER')

        return {
          isSuccessful: true,
          event: result.records,
        }
      })
      .catch((error) => {
        console.log(error)
        return { isSuccessful: false }
      })
  } catch (err) {
    return { isSuccessful: false }
  }
}

exports.get_event = async function (id, email) {
  const query = `MATCH (m:event)- [:OWNER] - (n: user)  WHERE id(m)=${id} 
                  OPTIONAL MATCH (m) <- [:PART] - (l:user) 
                  WITH m, n,COLLECT(l) AS PART
                  OPTIONAL MATCH (m)<-[r:PART]-(c: user {email: "${email}"}) 
                  with m,n,PART,c,r
                  RETURN  m, n , PART,c,r `
  try {
    return await runQuery(query)
      .then((result) => {
        return {
          isSuccessful: true,
          event: result.records,
        }
      })
      .catch((error) => {
        console.log(error)
        return { isSuccessful: false }
      })
  } catch (err) {
    console.log(err)
    return { isSuccessful: false }
  }
}

exports.TakePart_event_seat_counter = async function (id) {
  const query = `MATCH (n:event) WHERE id(n)=${id} and toInteger(n.seat) >0
  SET n.seat = toString(toInteger(n.seat) - 1)
  RETURN n`
  try {
    return await runQuery(query)
      .then((result) => {
        return {
          isSuccessful: true,
          event: result.records,
        }
      })
      .catch((error) => {
        console.log(error)
        return { isSuccessful: false }
      })
  } catch (err) {
    return { isSuccessful: false }
  }
}

exports.edit_event = async function (id, data) {
  const setClause = Object.keys(data)
    .map((key) => `m.${key} = $${key}`)
    .join(', ')

  const query = `MATCH (m:event) WHERE id(m)=${id} SET ${setClause}  RETURN m`
  try {
    return await runQuery(query, data)
      .then((result) => {
        return result.records.length == 0
          ? {
            isSuccessful: false,
            message: 'event not found',
          }
          : {
            isSuccessful: true,
            event: result.records[0].get('m'),
          }
      })
      .catch((error) => {
        console.log(error)
        return { isSuccessful: false }
      })
  } catch (err) {
    console.log(err)
    return { isSuccessful: false }
  }
}





exports.get_newEvents_yourComing = async function (user, skip, type) {
  const query = `MATCH (:user {email: "${user}"}) - [r:${type}] -> (m:event)
  WHERE datetime(m.eventDate + 'T' + m.eventTime + '+02:00') > datetime({timezone: 'Europe/Warsaw'})
                  OPTIONAL MATCH (m) <- [:PART] - (l:user) 
                  OPTIONAL MATCH (m) <- [:OWNER] - (n:user)
                  OPTIONAL MATCH (n)-[:OWNER]->(:event)<-[r2:REVIE]-()
                  WITH n,m ,COLLECT(l) AS PART, avg(toInteger(r2.star)) AS averageRating, COUNT( DISTINCT r2) AS reviewCount    
                  ORDER BY m.eventDate, m.eventTime
                  skip ${skip}
                  LIMIT 5
                  RETURN m,n, PART, averageRating, reviewCount`
  try {
    return await runQuery(query)
      .then((result) => {
        return result.records
      })
      .catch((error) => {
        console.log(error)
        return { isSuccessful: false }
      })
  } catch (err) {
    console.log(err)
    return { isSuccessful: false }
  }
}
// MATCH (owner:user {email: "${email}"})-[:OWNER]->(e:event)<-[r:REVIE]-()
// RETURN   avg(toInteger(r.star)) AS averageRating, COUNT(r) AS reviewCount`


exports.get_newEvents_popular = async function (skip) {
  const query = `MATCH (n: event )  
                WHERE datetime(n.eventDate + 'T' + n.eventTime + '+02:00') > datetime({timezone: 'Europe/Warsaw'})
                  OPTIONAL MATCH (n) <- [:OWNER] - (m:user) 
                  OPTIONAL MATCH (n) <- [:PART] - (l:user) 
                  OPTIONAL MATCH (m)-[:OWNER]->(e:event)<-[r:REVIE]-()
                  WITH n,m ,COLLECT(l) AS PART, avg(toInteger(r.star)) AS averageRating, COUNT(DISTINCT r) AS reviewCount
                  ORDER BY PART DESC
                  SKIP ${skip}
                  LIMIT 5
                  RETURN n,m,PART,averageRating,reviewCount`
  try {
    return await runQuery(query)
      .then((result) => {
        return result.records
      })
      .catch((error) => {
        console.log(error)
        return { isSuccessful: false }
      })
  } catch (err) {
    console.log(err)
    return { isSuccessful: false }
  }
}
exports.get_newEvents_coming = async function (skip) {
  const query = `MATCH (n: event )
  WHERE datetime(n.eventDate + 'T' +  n.eventTime + '+02:00') > datetime({timezone: 'Europe/Warsaw'})
                  OPTIONAL MATCH (n) <- [:PART] - (l:user) 
                  OPTIONAL MATCH (n) <- [:OWNER] - (m:user) 
                  OPTIONAL MATCH (m)-[:OWNER]->(e:event)<-[r:REVIE]-()
                  WITH n,m ,COLLECT(l) AS PART, avg(toInteger(r.star)) AS averageRating, COUNT( DISTINCT r) AS reviewCount
                  ORDER BY n.eventDate, n.eventTime
                  SKIP ${skip}
                  LIMIT 5
                  RETURN n,m,PART, averageRating, reviewCount`
  try {
    return await runQuery(query)
      .then((result) => {
        return result.records
      })
      .catch((error) => {
        console.log(error)
        return { isSuccessful: false }
      })
  } catch (err) {
    console.log(err)
    return { isSuccessful: false }
  }
}

// Rkomendacje n jeśli nie ma to wyświetlamy n2 jako " podobne "
exports.get_newEvents_recommended = async function (user, skip) {
  const query = `MATCH (u:user {email: "${user}"}) - [r:PART|OWNER] -> (m:event)
  OPTIONAL MATCH (m) <- [:OWNER|PART] - (l:user)
  OPTIONAL MATCH (n: event) <- [:OWNER|PART] - (l) 
  WHERE NOT (u)-[:OWNER|PART]-(n) AND datetime(n.eventDate + 'T' + n.eventTime + '+02:00' ) > datetime({timezone: 'Europe/Warsaw'})
  WITH n,m,COLLECT(l) AS PART,l,u
  ORDER BY n.eventDate, n.eventTime
  OPTIONAL MATCH (n2: event) 
  WHERE NOT (u)-[:OWNER|PART]-(n2) AND NOT (l)-[:OWNER|PART]-(n2) AND datetime(n2.eventDate + 'T' + n2.eventTime + '+02:00') > datetime({timezone: 'Europe/Warsaw'}) 
  OPTIONAL MATCH (n) <-[:OWNER]- (owner:user)
  OPTIONAL MATCH (owner)-[:OWNER]->(:event)<-[r2:REVIE]-()
  WITH n,m,l,n2,PART,u,owner,avg(toInteger(r2.star)) AS averageRating, COUNT(DISTINCT r2) AS reviewCount
  SKIP ${skip}
  LIMIT 5 
  RETURN  n,owner,n2,averageRating, reviewCount,l,PART`
  try {
    return await runQuery(query)
      .then((result) => {
        return result.records
      })
      .catch((error) => {
        console.log(error)
        return { isSuccessful: false }
      })
  } catch (err) {
    console.log(err)
    return { isSuccessful: false }
  }
}
exports.getEventByName = async function (name) {
  const query = `MATCH (e:event)
  WHERE toLower(e.eventName) CONTAINS toLower("${name}")
  RETURN e`
  try {
    return await runQuery(query)
      .then((result) => {
        return result.records
      })
      .catch((error) => {
        console.log(error)
        return { isSuccessful: false }
      })
  } catch (err) {
    console.log(err)
    return { isSuccessful: false }
  }
}

exports.delete_event = async function (id) {
  const query = `MATCH (n: event)-[r]-() 
  WHERE id(n) =  ${id}
  DELETE r ,n`
  try {
    return await runQuery(query)
      .then((result) => {
        return result.records
      })
      .catch((error) => {
        console.log(error)
        return { isSuccessful: false }
      })
  } catch (err) {
    console.log(err)
    return { isSuccessful: false }
  }
}
