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

exports.get_user = async function (username) {
  try {
    user = await runQuery(`MATCH (n:user WHERE n.username = '${username}' )
                            OPTIONAL MATCH (n)<-[:FOLLOW]-(c:user)
                          RETURN n, COUNT(c) AS followers`)
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

exports.get_all = async function (username) {
  try {
    return (users = await runQuery(`MATCH (n:user) WHERE n.username <>'${username}' RETURN n`).then((res) => {
      return res.records;
    }));
  } catch (error) {}
};

exports.edit_profile = async function (username, awatar) {
  const query = "MATCH (n: user {username: $username}) SET n.awatar=$awatar  RETURN n";
  const parameters = { username: username, awatar: awatar };
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

exports.edit_profile_about = async function (username, about) {
  const query = "MATCH (n: user {username: $username}) SET n.about=$about  RETURN n";
  const parameters = { username: username, about: about };
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
