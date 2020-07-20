const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const app = express();
const router = require("./router");
const mongoose = require("mongoose");

require("dotenv").config();

// DB setup
mongoose.connect(process.env.DB_ATLAS, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

// App setup
app.use(morgan("combined")); // logging framework for debugging
app.use(bodyParser.json({ type: "*/*" })); // parse all requests to JSON
router(app);

// Server setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log("server is listening on: ", port);
