// const { session } = require("../db_connect");

// exports.count_relation = async function(username,relation){
//     try {
//        const result =  await session.run(`MATCH (n:user)-[:${relation}]-> (m:user) WHERE n.username='${username}' RETURN count(*) LIMIT 1 `)
//         return {isSuccessful: true, data: result.records[0].get('count(*)')['low']}
//     } catch (error) {
//         console.log(error);
//         return{isSuccessful: false, error}
//     }

// }