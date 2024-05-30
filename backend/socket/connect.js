const {
  create_event,
  get_newEvents_coming,
  get_newEvents_after,
  get_newEvents_popular,
  get_newEvents_yourComing,
  get_newEvents_recommended,
  get_oldevent,
  get_event_range,
} = require("../db/models/event");
const relations = require("../db/models/relations");
const { auth } = require("express-oauth2-jwt-bearer");
const { expressjwt: jwt } = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const { use } = require("passport");
const cron = require("node-cron");

const jwtCheck = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.Auth_DOMAIN}/.well-known/jwks.json`,
  }),
  audience: process.env.AUDIENCE,
  issuer: `https://${process.env.Auth_DOMAIN}/`,
  algorithms: ["RS256"],
});

module.exports = (io) => {
  const connect = io.of("connect");
  connect.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error"));
    }
    jwtCheck({ headers: { authorization: `Bearer ${token}` } }, {}, (err) => {
      if (err) {
        console.log(err);
        return socket.disconnect(true);
      }
      next();
    });
  });
  connect.on("connect", async (socket) => {
    try {
      const { email, name, nickname } = socket.handshake.query;
      console.log("# Socket.io: połączono: ", email);

      follow_arr = await relations.find_all_follow(email);

      follow_arr.data.map(async (element) => {
        const eventDateTime = new Date(
          `${element._fields[0].properties.eventDate}T${element._fields[0].properties.eventTime}`
        );
        const eventDateTimeMinus12Hours = new Date(eventDateTime.getTime() - 24 * 60 * 60 * 1000);
        const month = eventDateTimeMinus12Hours.getMonth() + 1;
        const day = eventDateTimeMinus12Hours.getDate();
        const hour = eventDateTimeMinus12Hours.getHours();
        const minute = eventDateTimeMinus12Hours.getMinutes();
        const cronExpression = `${minute} ${hour} ${day} ${month} *`;
        console.log(cronExpression);
        cron.schedule(cronExpression, () => {
          console.log(cronExpression);
          socket.emit("Powiadomienie", element._fields[0]);
          console.log("wysłane");
        });
      });

      socket.on("allMyEvents", async (_data) => {
        event_array = await relations.find_all_events(username);
        socket.emit("allevents", event_array);
      });

      socket.on("get_new_event", async (data) => {
        const { name, skip, username } = data;
        switch (name) {
          case "popular":
            const newEventPopular = await get_newEvents_popular(skip);
            socket.emit("receive_new_event_popular", newEventPopular);
            break;

          case "yourincomming":
            const newEvent_yourCOming = await get_newEvents_yourComing(username, skip);
            socket.emit("receive_new_event_yourComing", newEvent_yourCOming);
            break;

          case "incomming":
            const newEvent_inComing = await get_newEvents_coming(skip);
            socket.emit("receive_new_event_inComing", newEvent_inComing);
            break;

          case "recommended":
            const newEvent_rem = await get_newEvents_recommended(username, skip);
            socket.emit("receive_new_event_reco", newEvent_rem);
            break;

          default:
            console.log("defoult:, ", data);
            break;
        }
      });

      socket.on("get_event", async (data) => {
        const { end, start } = data;
        if (end == null) {
          const newevents = await get_newEvents_after(username, 0, "DESC");
          socket.emit("receive_event", newevents);
        } else {
          const newevent = await get_event_range(username, start, end);
          socket.emit("receive_event", newevent);
        }
      });

      socket.on("get_old_event", async (data) => {
        const { end } = data;
        const oldevent = await get_oldevent(username, end);
        socket.emit("receive_old_event", oldevent);
      });

      socket.on("addEvent", async (data) => {
        if (data.comment == "comment") {
          const res = await create_event(data.content, data.owner, data.comment, data.idToComment);
          connect.emit(`event-${data.idToComment}`, data.idToComment);
          socket.emit("create_event", res);
        } else if (data.comment == "quote") {
          const res = await create_event(data.content, data.owner);
          const eventId = res.event[0]._fields[0].identity.low;
          await relations.create_relation_between_events(eventId, data.idToComment, "QUOTE");
          connect.to(data.owner).emit("user_event", { owner: data.owner, id: res.event[0]._fields[0].identity.low });
          socket.emit("create_event", res);
        } else {
          const { eventName, eventTime, eventDate, eventImage, eventDescription, address, seat } = data.content;
          const res = await create_event(
            eventName,
            eventDate,
            eventTime,
            eventImage,
            eventDescription,
            address,
            data.owner,
            seat
          );
          // connect.to(data.owner).emit("user_event", { owner: data.owner, id: res.event[0]._fields[0].identity.low });
          socket.emit("create_event", res);
        }
      });

      socket.on("relation_user_user", async (data) => {
        const { follower_user, folowee_user, relation_name } = data;
        if (data.toDo == "DELETE") {
          const res = relations.delete_realtion(follower_user, folowee_user, relation_name);
          socket.leave(folowee_user);
          socket.emit("relation_user_user", res);
        } else {
          const res = await relations.create_relation_between_users(follower_user, folowee_user, relation_name);
          if (relation_name == "FOLLOW") {
            socket.join(folowee_user);
            connect.emit(folowee_user, { user: follower_user, message: relation_name });
          } else if (relation_name == "BAN") {
            connect.emit(folowee_user, { user: follower_user, message: relation_name });
            const res = await relations.delete_realtion(folowee_user, follower_user, "FOLLOW");
            socket.emit("relation_user_user", res);
          }
          socket.emit("relation_user_user", res);
        }
      });

      socket.on("disconnect", () => {
        console.log("# Socket.io: rozłączono");
      });

      socket.on("error", (err) => {
        console.dir(err.message);
      });
    } catch (error) {
      console.error("Błąd podczas obsługi połączenia Socket.IO:", error);
    }
  });
};
