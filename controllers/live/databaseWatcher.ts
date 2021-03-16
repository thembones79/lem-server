import { NextFunction } from "express";
import { Socket } from "socket.io";
import { Order } from "../../models/order";
import { getLiveViewSockets } from "./getLiveViewSockets";

const watchChangeOnOrderCollection = (socket: Socket) => {
  Order.watch().on("change", () => getLiveViewSockets(socket));
};

export const databaseWatcher = function (socket: Socket) {
  try {
    watchChangeOnOrderCollection(socket);
    Order.watch().on("error", () => watchChangeOnOrderCollection(socket));
  } catch (error) {
    return console.log(error);
  }
};
