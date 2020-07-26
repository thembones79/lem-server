const express = require("express");
const http = require("http");
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
app.use(cors());
app.use(bodyParser.json({ type: "*/*" })); // parse all requests to JSON
router(app);

// Server setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
//server.listen(port);
app.listen(port);
console.log("server is listening on: ", port);
