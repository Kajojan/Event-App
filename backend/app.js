require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const passport = require("passport");
const flash = require("express-flash");
const express_session = require("express-session");
const bodyParser = require("body-parser");
const initializePassport = require("./passport/passport-config");
const auth_routes = require("./routes/auth_routes");
const sessionStore = require("sessionstore");
const event_router = require("./routes/event_routes");
const user_router = require("./routes/user_routes");
const aws_router = require("./aws/aws_router");
const { auth } = require("express-oauth2-jwt-bearer");

app.use(require("cookie-parser")());

const jwtCheck = auth({
  audience: process.env.AUDIENCE,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
  tokenSigningAlg: process.env.TOKEN_SIGNING_ALG,
});

app.use((req, res, next) => {
  console.log(`request: ${req.method} ${req.url}`);
  next();
});

app.use(
  cors({
    origin: ["https://localhost:3000", "*"],
    methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"],
    allowedHeaders: [
      "Access-Control-Allow-Origin",
      "X-Requested-With",
      "content-type",
      "authorization",
      "Access-Control-Allow-Origin",
    ],
    credentials: true,
  })
);

app.use(bodyParser.json()).use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.json());

app.use(flash());

const sessionExpress = express_session({
  secret: process.env.SESSION_SECRET || "seckret",
  saveUninitialized: false,
  resave: false,
  expires: 1000 * 60 * 60 * 24 * 30,
  store: sessionStore.createSessionStore(),
  cookie: {
    sameSite: false,
    secure: true,
    httpOnly: true,
  },
});
app.use(sessionExpress);
app.use(passport.initialize());
app.use(passport.session());

const { neo4j_session, driver, runQuery } = require("./db/db_connect");

app.use("/", auth_routes);
app.use("/api/event", event_router);
app.use("/api/user", jwtCheck, user_router);
app.use("/api/aws", aws_router);

const fs = require("fs");
const https = require("https");
const server = https.createServer(
  {
    key: fs.readFileSync("./ssl/my.key"),
    cert: fs.readFileSync("./ssl/my.crt"),
  },
  app
);

const { Server } = require("socket.io");
const socketFunc = require("./socket/connect");
const sio = new Server(server, {
  cors: {
    origin: ["https://localhost:3000", "*"],
    methods: ["GET", "POST"],
    allowedHeaders: ["X-Requested-With", "content-type"],
    credentials: true,
  },
});

socketFunc(sio);

const apiPort = process.env.PORT || 4000;
const apiHost = process.env.API_HOST || "localhost";

runQuery("RETURN 1")
  .then(() => {
    server.listen(apiPort, async () => {
      try {
        await runQuery("DROP CONSTRAINT unique_user");
      } finally {
        await runQuery("CREATE CONSTRAINT unique_user FOR (user:user) REQUIRE user.email IS UNIQUE");
      }

      console.log(`API server available from: https://${apiHost}:${apiPort}`);
    });
  })
  .catch((error) => {
    console.error("Błąd podczas nawiązywania połączenia z bazą danych Neo4j:", error);
  });

process.on("SIGINT", async () => {
  await driver.close();
  server.close(() => {
    console.log("Serwer close.");
    process.exit(0);
  });
});
