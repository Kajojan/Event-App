const { runQuery } = require("../db_connect");

exports.create_user = async function (name, email, picture, nickname) {
  const query = `Merge (n:user {name: $name,  picture: $picture, nickname: $nickname, email: $email})
  RETURN n`;

  const parameters = {
    name: name,
    email: email,
    picture: picture,
    nickname: nickname,
  };

  try {
    user = await runQuery(query, parameters)
      .then((result) => {
        return {
          user: result.records[0].get("n"),
          isSuccessful: true,
        };
      })
      .catch((error) => {
        console.log(error);
        return { message: "User exists", isSuccessful: false };
      });
  } catch (err) {
    return { message: err, isSuccessful: false };
  }
  return user;
};

exports.get_user = async function (email) {
  try {
    user = await runQuery(`MATCH (n:user WHERE n.email = '${email}' ) RETURN n`)
      .then((result) => {
        if (result.records.length != 0) {
          return {
            user: result.records,
            isSuccessful: true,
          };
        }
        return { message: "User not found", isSuccessful: false };
      })
      .catch((error) => {
        return { message: "User not found", isSuccessful: false };
      });
  } catch (err) {
    return { message: err, isSuccessful: false };
  }
  return user;
};

exports.edit_profile = async function (email, data) {
  const setClause = Object.keys(data)
    .map((key) => `n.${key} = $${key}`)
    .join(", ");

  const query = `MATCH (n: user {email: $email})   SET ${setClause}  RETURN n`;
  const parameters = { email: email, ...data };
  try {
    return await runQuery(query, parameters).then((result) => {
      return result.records.length == 0
        ? {
            isSuccessful: false,
            message: "user not found",
          }
        : {
            isSuccessful: true,
            user: result.records[0].get("n"),
          };
    });
  } catch (error) {
    console.log(error);
    return {
      isSuccessful: false,
    };
  }
};

exports.get_relations_count = async function (email) {
  console.log(email);
  const query = `MATCH (n:event)<-[:PART]-(l:user)
  WHERE l.email = '${email}' AND  date(n.eventDate) < date(datetime())
    WITH n, COUNT (n) AS partCount,l
    OPTIONAL MATCH (n2:event)<-[:OWNER]-(l)
    RETURN COUNT(DISTINCT 1) AS ownerCount, SUM(partCount) AS partCount`;

  try {
    return await runQuery(query).then((result) => {
      return result.records.length == 0
        ? {
            isSuccessful: false,
            message: "user not found",
          }
        : {
            isSuccessful: true,
            values: result.records[0]._fields,
          };
    });
  } catch (error) {
    console.log(error);
    return {
      isSuccessful: false,
    };
  }
};
