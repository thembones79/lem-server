import { Request, Response, NextFunction } from "express";
import { Order } from "../../models/order";

export const getFullOrders = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  Order.find().cursor({ transform: JSON.stringify }).pipe(res.type("json"));
};
