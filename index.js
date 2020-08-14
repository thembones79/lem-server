const express = require("express");
const http = require("http");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const app = express();
const router = require("./router");
const mongoose = require("mongoose");
const cors = require("cors");
const keys = require("./config/keys");

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
//server.listen(port);
app.listen(port);
console.log("server is listening on: ", port);
