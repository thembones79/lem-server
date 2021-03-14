const jwt = require("jwt-simple");
import ioserver, { Socket, ServerOptions, Server } from "socket.io";
import { Router, Request, Response, NextFunction } from "express";
const LiveController = require("./controllers/live");

import { keys } from "./config/keys";

interface ISocketWithId extends Socket {
  _id: string;
}

export const sockets = function (io: Server) {
  try {
    // middleware
    io.use((socket: Socket, next: NextFunction) => {
      let token = socket.handshake.query.authorization;

      const decoded = jwt.decode(token, keys.secret);

      if (decoded) {
        //// socket._id = decoded.sub;
        next();
        return;
      }
      next(new Error("authentication error"));
      return;
    });

    // then
    io.on("connection", (socket) => {
      console.log("New client connected");
      LiveController.databaseWatcher(socket);
      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });
    });
  } catch (err) {
    return console.log(err);
  }
};
