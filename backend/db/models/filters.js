const { runQuery } = require('../db_connect')



exports.get_filters = async function () {
  const query = `
CALL {
  MATCH (e:event)
  WHERE datetime({date: date(e.eventDate), time: time(e.eventTime + ':00')}) > datetime()
  UNWIND e.eventType AS type
  WITH type, count(*) AS count
  RETURN collect({ value: type, count: count }) AS types
}

CALL {
  MATCH (e:event)
  WHERE datetime({date: date(e.eventDate), time: time(e.eventTime + ':00')}) > datetime()
  WITH split(e.detailAddress, "; ") AS pairs
  UNWIND pairs AS pair
  WITH split(pair, ":") AS kv
  WHERE trim(kv[0]) = 'country'
  WITH trim(kv[1]) AS country, count(*) AS count
  RETURN collect({ value: country, count: count }) AS countries
}

CALL {
  MATCH (e:event)
  WHERE datetime({date: date(e.eventDate), time: time(e.eventTime + ':00')}) > datetime()
  WITH split(e.detailAddress, "; ") AS pairs
  UNWIND pairs AS pair
  WITH split(pair, ":") AS kv
  WHERE trim(kv[0]) = 'locality'
  WITH trim(kv[1]) AS city, count(*) AS count
  RETURN collect({ value: city, count: count }) AS cities
}

CALL {
  MATCH (e:event)
  WHERE datetime({date: date(e.eventDate), time: time(e.eventTime + ':00')}) > datetime()
  WITH e.seat AS seat, count(*) AS count
  RETURN collect({ value: seat, count: count }) AS seats
}

RETURN types, countries, cities, seats

    `
  try {
    return await runQuery(query)
      .then((result) => {
        const record = result.records[0]
        const filters = {
          types: record.get('types'),
          seats: record.get('seats'),
          countries: record.get('countries'),
          cities: record.get('cities')
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


exports.get_filters_arg = async function ({ types = [], countries: country = [], cities: city = [], startDate = null, endDate = null, seats = [] }) {

  const query3 = `
// Typy wydarzeń
CALL {
  MATCH (e:event)
  WHERE (
      ($startDate IS NULL AND datetime({date: date(e.eventDate), time: time(e.eventTime + ':00')}) > datetime()) OR
      ($startDate IS NOT NULL AND datetime({date: date(e.eventDate), time: time(e.eventTime + ':00')}) >= datetime($startDate))
    )
    AND ($endDate IS NULL OR datetime({date: date(e.eventDate), time: time(e.eventTime + ':00')}) <= datetime($endDate))
    AND (size($types) = 0 OR ANY(t IN e.eventType WHERE t IN $types))
    AND (size($country) = 0 OR ANY(pair IN split(e.detailAddress, "; ") 
         WHERE trim(split(pair, ":")[0]) = 'country' AND trim(split(pair, ":")[1]) IN $country))
    AND (size($city) = 0 OR ANY(pair IN split(e.detailAddress, "; ") 
         WHERE trim(split(pair, ":")[0]) = 'locality' AND trim(split(pair, ":")[1]) IN $city))
    AND (size($seats) = 0 OR e.seat IN $seats)
  UNWIND e.eventType AS type
  WITH type, count(DISTINCT e) AS eventCount
  RETURN collect({ value: type, count: eventCount }) AS types
}

// Kraje
CALL {
  MATCH (e:event)
  WHERE (
      ($startDate IS NULL AND datetime({date: date(e.eventDate), time: time(e.eventTime + ':00')}) > datetime()) OR
      ($startDate IS NOT NULL AND datetime({date: date(e.eventDate), time: time(e.eventTime + ':00')}) >= datetime($startDate))
    )
    AND ($endDate IS NULL OR datetime({date: date(e.eventDate), time: time(e.eventTime + ':00')}) <= datetime($endDate))
    AND (size($types) = 0 OR ANY(t IN e.eventType WHERE t IN $types))
    AND (size($country) = 0 OR ANY(pair IN split(e.detailAddress, "; ") 
         WHERE trim(split(pair, ":")[0]) = 'country' AND trim(split(pair, ":")[1]) IN $country))
    AND (size($city) = 0 OR ANY(pair IN split(e.detailAddress, "; ") 
         WHERE trim(split(pair, ":")[0]) = 'locality' AND trim(split(pair, ":")[1]) IN $city))
    AND (size($seats) = 0 OR e.seat IN $seats)
  WITH [pair IN split(e.detailAddress, "; ") WHERE trim(split(pair, ":")[0]) = 'country' | trim(split(pair, ":")[1])] AS countries, e
  UNWIND countries AS country
  WITH country, count(DISTINCT e) AS eventCount
  RETURN collect({ value: country, count: eventCount }) AS countries
}

// Miasta
CALL {
  MATCH (e:event)
  WHERE (
      ($startDate IS NULL AND datetime({date: date(e.eventDate), time: time(e.eventTime + ':00')}) > datetime()) OR
      ($startDate IS NOT NULL AND datetime({date: date(e.eventDate), time: time(e.eventTime + ':00')}) >= datetime($startDate))
    )
    AND ($endDate IS NULL OR datetime({date: date(e.eventDate), time: time(e.eventTime + ':00')}) <= datetime($endDate))
    AND (size($types) = 0 OR ANY(t IN e.eventType WHERE t IN $types))
    AND (size($country) = 0 OR ANY(pair IN split(e.detailAddress, "; ") 
         WHERE trim(split(pair, ":")[0]) = 'country' AND trim(split(pair, ":")[1]) IN $country))
    AND (size($city) = 0 OR ANY(pair IN split(e.detailAddress, "; ") 
         WHERE trim(split(pair, ":")[0]) = 'locality' AND trim(split(pair, ":")[1]) IN $city))
    AND (size($seats) = 0 OR e.seat IN $seats)
  WITH [pair IN split(e.detailAddress, "; ") WHERE trim(split(pair, ":")[0]) = 'locality' | trim(split(pair, ":")[1])] AS cities, e
  UNWIND cities AS city
  WITH city, count(DISTINCT e) AS eventCount
  RETURN collect({ value: city, count: eventCount }) AS cities
}

// Miejsca (seats)
CALL {
  MATCH (e:event)
  WHERE (
      ($startDate IS NULL AND datetime({date: date(e.eventDate), time: time(e.eventTime + ':00')}) > datetime()) OR
      ($startDate IS NOT NULL AND datetime({date: date(e.eventDate), time: time(e.eventTime + ':00')}) >= datetime($startDate))
    )
    AND ($endDate IS NULL OR datetime({date: date(e.eventDate), time: time(e.eventTime + ':00')}) <= datetime($endDate))
    AND (size($types) = 0 OR ANY(t IN e.eventType WHERE t IN $types))
    AND (size($country) = 0 OR ANY(pair IN split(e.detailAddress, "; ") 
         WHERE trim(split(pair, ":")[0]) = 'country' AND trim(split(pair, ":")[1]) IN $country))
    AND (size($city) = 0 OR ANY(pair IN split(e.detailAddress, "; ") 
         WHERE trim(split(pair, ":")[0]) = 'locality' AND trim(split(pair, ":")[1]) IN $city))
    AND (size($seats) = 0 OR e.seat IN $seats)
  WITH e.seat AS seat, e
  WITH seat, count(DISTINCT e) AS eventCount
  RETURN collect({ value: seat, count: eventCount }) AS seats
}

RETURN types, countries, cities, seats

`

  const params = {
    types,
    country,
    city,
    startDate,
    endDate,
    seats
  }

  try {
    return await runQuery(query3, params)
      .then((result) => {

        const record = result.records[0]
        const filters = {
          types: record.get('types'),
          seats: record.get('seats'),
          countries: record.get('countries'),
          cities: record.get('cities')
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
  seats = [] })
{

  let query = `
    MATCH (e:event)
    WHERE datetime({date: date(coalesce(e.eventDate, '1970-01-01')), time: time(coalesce(e.eventTime, '00:00') + ':00')}) > datetime()`

  if (types && types.length > 0) {
    query += ' AND ANY(t IN e.eventType WHERE t IN $types)'
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
    query += ' AND datetime({date: date(e.eventDate), time: time(e.eventTime + \':00\')}) >= datetime($startDate)'
  }
  if (endDate) {
    query += ' AND datetime({date: date(e.eventDate), time: time(e.eventTime + \':00\')}) <= datetime($endDate)'
  }

  query += `
  WITH e
  MATCH (e)-[:OWNER]-(owner:user)
  OPTIONAL MATCH (owner)-[:OWNER]->(:event)<-[r2:REVIE]-()

  RETURN e, owner, r2,avg(toInteger(r2.star)) AS averageRating, COUNT(r2) AS reviewCount
  `


  const params = {
    types,
    country,
    city,
    startDate,
    endDate,
    seats
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
