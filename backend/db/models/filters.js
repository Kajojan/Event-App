const { runQuery } = require('../db_connect')

exports.get_filters = async function () {
  const query = `
CALL {
  MATCH (e:event)
WHERE datetime({
  date: date(e.eventDate),
  time: time({hour: toInteger(split(e.eventTime, ':')[0]), minute: toInteger(split(e.eventTime, ':')[1])}),
  timezone: 'Europe/Warsaw'
}) > datetime({timezone: 'Europe/Warsaw'})  UNWIND e.eventType AS type
  WITH type, count(*) AS count
  RETURN collect({ value: type, count: count }) AS types
}

CALL {
  MATCH (e:event)
WHERE datetime({
  date: date(e.eventDate),
  time: time({hour: toInteger(split(e.eventTime, ':')[0]), minute: toInteger(split(e.eventTime, ':')[1])}),
  timezone: 'Europe/Warsaw'
}) > datetime({timezone: 'Europe/Warsaw'})  WITH split(e.detailAddress, "; ") AS pairs
  UNWIND pairs AS pair
  WITH split(pair, ":") AS kv
  WHERE trim(kv[0]) = 'country'
  WITH trim(kv[1]) AS country, count(*) AS count
  RETURN collect({ value: country, count: count }) AS countries
}

CALL {
  MATCH (e:event)
WHERE datetime({
  date: date(e.eventDate),
  time: time({hour: toInteger(split(e.eventTime, ':')[0]), minute: toInteger(split(e.eventTime, ':')[1])}),
  timezone: 'Europe/Warsaw'
}) > datetime({timezone: 'Europe/Warsaw'})  WITH split(e.detailAddress, "; ") AS pairs
  UNWIND pairs AS pair
  WITH split(pair, ":") AS kv
  WHERE trim(kv[0]) = 'locality'
  WITH trim(kv[1]) AS city, count(*) AS count
  RETURN collect({ value: city, count: count }) AS cities
}

CALL {
  MATCH (e:event)
WHERE datetime({
  date: date(e.eventDate),
  time: time({hour: toInteger(split(e.eventTime, ':')[0]), minute: toInteger(split(e.eventTime, ':')[1])}),
  timezone: 'Europe/Warsaw'
}) > datetime({timezone: 'Europe/Warsaw'})  WITH e.seat AS seat, count(*) AS count
  RETURN collect({ value: seat, count: count }) AS seats
}

CALL {
  MATCH (e:event)
  OPTIONAL MATCH (n:user)-[:OWNER]->(:event)<-[r2:REVIE]-()
  WHERE datetime({
    date: date(e.eventDate),
    time: time({
      hour: toInteger(split(e.eventTime, ':')[0]),
      minute: toInteger(split(e.eventTime, ':')[1])
    }),
    timezone: 'Europe/Warsaw'
  }) < datetime({timezone: 'Europe/Warsaw'})
  WITH n, avg(toInteger(r2.star)) AS averageRating, COUNT(r2) AS reviewCount,  count(*) AS count
  WHERE  averageRating > 0
  RETURN collect({ value: averageRating, count: count}) AS eventRatings  
}

RETURN types, countries, cities, seats, eventRatings`

  try {
    return await runQuery(query)
      .then((result) => {
        const record = result.records[0]
        const filters = {
          types: record.get('types'),
          seats: record.get('seats'),
          countries: record.get('countries'),
          cities: record.get('cities'),
          stars: record.get('eventRatings')
        }
        return {
          isSuccessful: true,
          filters: filters,
        }
      })
      .catch((error) => {
        console.log('error', error)
        return { isSuccessful: false }
      })
  } catch (err) {
    console.log(err)
    return { isSuccessful: false }
  }
}


exports.get_filters_arg = async function ({
  types = [],
  countries: country = [],
  cities: city = [],
  startDate = null,
  endDate = null,
  seats = [],
  star = [0] }) {
  const query = `
// Typy
CALL {
  MATCH (e:event)<-[:OWNER]-(n:user)
  WHERE 
   ($startDate IS NULL OR datetime({
    date: date(e.eventDate),
    time: time(e.eventTime + ':00'),
    timezone: 'Europe/Warsaw'
    }) >= datetime($startDate)) AND
    ($endDate IS NULL OR datetime({date: date(e.eventDate), time: time(e.eventTime + ':00'), timezone: 'Europe/Warsaw'}) <= datetime($endDate) ) AND
    (size($types) = 0 OR ALL(t IN $types WHERE t IN e.eventType)) AND
    (size($country) = 0 OR ANY(pair IN split(e.detailAddress, "; ") 
        WHERE trim(split(pair, ":")[0]) = 'country' AND trim(split(pair, ":")[1]) IN $country)) AND
    (size($city) = 0 OR ANY(pair IN split(e.detailAddress, "; ") 
        WHERE trim(split(pair, ":")[0]) = 'locality' AND trim(split(pair, ":")[1]) IN $city)) AND
    (size($seats) = 0 OR e.seat IN $seats)
  OPTIONAL MATCH (n)-[:OWNER]->(e2)<-[r2:REVIE]-()
  WITH e, coalesce(avg(toFloat(r2.star)), 0) AS averageRating
  WHERE (size($star) = 0 OR averageRating >= toFloat($star[0]))
  UNWIND e.eventType AS type
  WITH type, count(DISTINCT e) AS eventCount
  RETURN collect({ value: type, count: eventCount }) AS types
}

// Kraje
CALL {
  MATCH (e:event)<-[:OWNER]-(n:user)
  WHERE 
    ($startDate IS NULL OR datetime({date: date(e.eventDate), time: time(e.eventTime + ':00'), timezone: 'Europe/Warsaw' }) >= datetime($startDate)) AND
    ($endDate IS NULL OR datetime({date: date(e.eventDate), time: time(e.eventTime + ':00'), timezone: 'Europe/Warsaw'}) <= datetime($endDate)) AND
    (size($types) = 0 OR ALL(t IN $types WHERE t IN e.eventType)) AND
    (size($country) = 0 OR ANY(pair IN split(e.detailAddress, "; ") 
        WHERE trim(split(pair, ":")[0]) = 'country' AND trim(split(pair, ":")[1]) IN $country)) AND
    (size($city) = 0 OR ANY(pair IN split(e.detailAddress, "; ") 
        WHERE trim(split(pair, ":")[0]) = 'locality' AND trim(split(pair, ":")[1]) IN $city)) AND
    (size($seats) = 0 OR e.seat IN $seats)
  OPTIONAL MATCH (n)-[:OWNER]->(e2)<-[r2:REVIE]-()
  WITH e, coalesce(avg(toFloat(r2.star)), 0) AS averageRating
  WHERE (size($star) = 0 OR averageRating >= toFloat($star[0]))
  WITH [pair IN split(e.detailAddress, "; ") WHERE trim(split(pair, ":")[0]) = 'country' | trim(split(pair, ":")[1])] AS countries, e
  UNWIND countries AS country
  WITH country, count(DISTINCT e) AS eventCount
  RETURN collect({ value: country, count: eventCount }) AS countries
}

// Miasta
CALL {
  MATCH (e:event)<-[:OWNER]-(n:user)
  WHERE 
    ($startDate IS NULL OR datetime({date: date(e.eventDate), time: time(e.eventTime + ':00'), timezone: 'Europe/Warsaw'}) >= datetime($startDate)) AND
    ($endDate IS NULL OR datetime({date: date(e.eventDate), time: time(e.eventTime + ':00'), timezone: 'Europe/Warsaw'}) <= datetime($endDate)) AND
    (size($types) = 0 OR ALL(t IN $types WHERE t IN e.eventType)) AND
    (size($country) = 0 OR ANY(pair IN split(e.detailAddress, "; ") 
        WHERE trim(split(pair, ":")[0]) = 'country' AND trim(split(pair, ":")[1]) IN $country)) AND
    (size($city) = 0 OR ANY(pair IN split(e.detailAddress, "; ") 
        WHERE trim(split(pair, ":")[0]) = 'locality' AND trim(split(pair, ":")[1]) IN $city)) AND
    (size($seats) = 0 OR e.seat IN $seats)
  OPTIONAL MATCH (n)-[:OWNER]->(e2)<-[r2:REVIE]-()
  WITH e, coalesce(avg(toFloat(r2.star)), 0) AS averageRating
  WHERE (size($star) = 0 OR averageRating >= toFloat($star[0]))
  WITH [pair IN split(e.detailAddress, "; ") WHERE trim(split(pair, ":")[0]) = 'locality' | trim(split(pair, ":")[1])] AS cities, e
  UNWIND cities AS city
  WITH city, count(DISTINCT e) AS eventCount
  RETURN collect({ value: city, count: eventCount }) AS cities
}

// Miejsca
CALL {
  MATCH (e:event)<-[:OWNER]-(n:user)
  WHERE 
    ($startDate IS NULL OR datetime({date: date(e.eventDate), time: time(e.eventTime + ':00'), timezone: 'Europe/Warsaw'}) >= datetime($startDate)) AND
    ($endDate IS NULL OR datetime({date: date(e.eventDate), time: time(e.eventTime + ':00'), timezone: 'Europe/Warsaw'}) <= datetime($endDate)) AND
    (size($types) = 0 OR ALL(t IN $types WHERE t IN e.eventType)) AND
    (size($country) = 0 OR ANY(pair IN split(e.detailAddress, "; ") 
        WHERE trim(split(pair, ":")[0]) = 'country' AND trim(split(pair, ":")[1]) IN $country)) AND
    (size($city) = 0 OR ANY(pair IN split(e.detailAddress, "; ") 
        WHERE trim(split(pair, ":")[0]) = 'locality' AND trim(split(pair, ":")[1]) IN $city)) AND
    (size($seats) = 0 OR e.seat IN $seats)
  OPTIONAL MATCH (n)-[:OWNER]->(e2)<-[r2:REVIE]-()
  WITH e, coalesce(avg(toFloat(r2.star)), 0) AS averageRating
  WHERE (size($star) = 0 OR averageRating >= toFloat($star[0]))
  WITH e.seat AS seat, count(DISTINCT e) AS eventCount
  RETURN collect({ value: seat, count: eventCount }) AS seats
}

// Oceny
CALL {
  MATCH (e:event)<-[:OWNER]-(n:user)
  WHERE 
    ($startDate IS NULL OR datetime({date: date(e.eventDate), time: time(e.eventTime + ':00'), timezone: 'Europe/Warsaw'}) >= datetime($startDate)) AND
    ($endDate IS NULL OR datetime({date: date(e.eventDate), time: time(e.eventTime + ':00'), timezone: 'Europe/Warsaw'}) <= datetime($endDate)) AND
    (size($types) = 0 OR ALL(t IN $types WHERE t IN e.eventType)) AND
    (size($country) = 0 OR ANY(pair IN split(e.detailAddress, "; ") 
        WHERE trim(split(pair, ":")[0]) = 'country' AND trim(split(pair, ":")[1]) IN $country)) AND
    (size($city) = 0 OR ANY(pair IN split(e.detailAddress, "; ") 
        WHERE trim(split(pair, ":")[0]) = 'locality' AND trim(split(pair, ":")[1]) IN $city)) AND
    (size($seats) = 0 OR e.seat IN $seats)
  WITH DISTINCT n,e

  OPTIONAL MATCH (n)-[:OWNER]->(e2)<-[r2:REVIE]-()
  WITH n,e, coalesce(avg(toInteger(r2.star)), 0) AS averageRating
  WHERE (size($star) = 0 OR averageRating >= toFloat($star[0]))
  WITH averageRating, count(DISTINCT e) AS eventCount

  RETURN collect(DISTINCT { value: averageRating, count: eventCount }) AS averageRatings
}

RETURN types, countries, cities, seats, averageRatings

`

  const params = {
    types,
    country,
    city,
    startDate,
    endDate,
    seats,
    star
  }

  try {
    return await runQuery(query, params)
      .then((result) => {

        const record = result.records[0]
        const filters = {
          types: record.get('types'),
          seats: record.get('seats'),
          countries: record.get('countries'),
          cities: record.get('cities'),
          star: record.get('averageRatings')
        }
        return {
          isSuccessful: true,
          filters: filters,
        }
      })
      .catch((error) => {
        console.log('error', error)
        return { isSuccessful: false }
      })
  } catch (err) {
    console.log(err)
    return { isSuccessful: false }
  }
}


exports.get_filters_events = async function ({
  types = [],
  countries: country = [],
  cities: city = [],
  startDate = null,
  endDate = null,
  seats = [],
  star = [0],
  skip = 0,
  limit = 5 })
{

  let query = `
  MATCH (e:event)
  WHERE datetime({
    date: date(coalesce(e.eventDate, '1970-01-01')),
    time: time({
      hour: toInteger(split(coalesce(e.eventTime, '00:00'), ':')[0]),
      minute: toInteger(split(coalesce(e.eventTime, '00:00'), ':')[1])
    }),
    timezone: 'Europe/Warsaw'
  }) > datetime({timezone: 'Europe/Warsaw'})
`

  if (types && types.length > 0) {
    query += ' AND ALL(t IN $types WHERE t IN e.eventType)'
  }

  if (country && country.length > 0) {
    query += ` AND ANY(pair IN split(e.detailAddress, "; ") 
             WHERE trim(split(pair, ":")[0]) = 'country' AND trim(split(pair, ":")[1]) IN $country)`
  }

  if (city && city.length > 0) {
    query += ` AND ANY(pair IN split(e.detailAddress, "; ") 
             WHERE trim(split(pair, ":")[0]) = 'locality' AND trim(split(pair, ":")[1]) IN $city)`
  }

  if (seats && seats.length > 0) {
    query += ' AND e.seat IN $seats'
  }

  if (startDate) {
    query += ' AND datetime({date: date(e.eventDate), time: time(e.eventTime + \':00\'), timezone: "Europe/Warsaw"}) >= datetime($startDate)'
  }

  if (endDate) {
    query += ' AND datetime({date: date(e.eventDate), time: time(e.eventTime + \':00\'), timezone: "Europe/Warsaw"}) <= datetime($endDate)'
  }

  query += `
  WITH e
  MATCH (e)-[:OWNER]-(owner:user)
  OPTIONAL MATCH (owner)-[:OWNER]->(:event)<-[r2:REVIE]-() 
  WITH e, owner, coalesce(avg(toFloat(r2.star)), 0) AS averageRating, COUNT(DISTINCT r2) AS reviewCount
`

  if (star && Array.isArray(star)) {
    query += ' WHERE averageRating >= toFloat($minStar)'
  }

  query += `
  SKIP toInteger($skip)
  LIMIT toInteger($limit)
  RETURN e, owner, toFloat($minStar) ,averageRating, reviewCount
`

  const params = {
    types,
    country,
    city,
    startDate,
    endDate,
    seats,
    star,
    minStar: star ? star[0] : null,
    skip,
    limit
  }

  try {
    return await runQuery(query, params)
      .then((result) => {
        return result
      })
      .catch((error) => {
        console.log('error', error)
        return { isSuccessful: false }
      })
  } catch (err) {
    console.log(err)
    return { isSuccessful: false }
  }
}
