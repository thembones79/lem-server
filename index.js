const express = require("express");
const http = require("http");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const app = express();
const router = require("./router");
const sockets = require("./sockets");
const mongoose = require("mongoose");
const cors = require("cors");
const whitelist = ["http://localhost:3000", "https://riverdi-lem.netlify.app"];
const corsOptions = {
  credentials: true, // This is important.
  origin: (origin, callback) => {
    if (whitelist.includes(origin)) return callback(null, true);

    callback(new Error("Not allowed by CORS"));
  },
};
const keys = require("./config/keys");
const options = {
  origins: whitelist,
};

require("dotenv").config();

// DB setup
mongoose.connect(keys.dbAtlas, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

// App setup
app.use(morgan("combined")); // logging framework for debugging
app.use(helmet());
app.use(cors());
app.use(bodyParser.json({ type: "*/*" })); // parse all requests to JSON
// forwarding to https on Heroku
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.header("x-forwarded-proto") !== "https")
      res.redirect(`https://${req.header("host")}${req.url}`);
    else next();
  });
}
router(app);

// Server setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);

// WebSockets setup
const io = require("socket.io")(server, options);

sockets(io);

server.listen(port);

console.log("server is listening on: ", port);
