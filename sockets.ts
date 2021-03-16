import jwt from "jwt-simple";
import ioserver, { Socket, ServerOptions, Server } from "socket.io";
import { Router, Request, Response, NextFunction } from "express";
import { databaseWatcher } from "./controllers/live";

import { keys } from "./config/keys";

interface ISocketWithId extends Socket {
  _id: string;
}

export const sockets = function (io: Server) {
  try {
    io.use((socket: Socket, next: NextFunction) => {
      let token = socket.handshake.query.authorization;

      const decoded = jwt.decode(token, keys.secret);

      if (decoded) {
        next();
        return;
      }
      next(new Error("authentication error"));
      return;
    });

    io.on("connection", (socket) => {
      console.log("New client connected");
      databaseWatcher(socket);
      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });
    });
  } catch (err) {
    return console.log(err);
  }
};
