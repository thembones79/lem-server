const jwt = require("jwt-simple");
const LiveController = require("./controllers/live");

const keys = require("./config/keys");

module.exports = function (io) {
  // middleware
  io.use((socket, next) => {
    let token = socket.handshake.query.authorization;

    const decoded = jwt.decode(token, keys.secret);

    if (decoded) {
      socket._id = decoded.sub;
      return next();
    }

    return next(new Error("authentication error"));
  });

  // then
  io.on("connection", (socket) => {
    console.log("New client connected");
    LiveController.databaseWatcher(socket);
    if (interval) {
      clearInterval(interval);
    }
    interval = setInterval(() => getApiAndEmit(socket), 1000);

    socket.on("disconnect", () => {
      console.log("Client disconnected");
      clearInterval(interval);
    });
  });
};
let interval;
const getApiAndEmit = (socket) => {
  const response = new Date();
  socket.emit("FromAPI", response);
};
