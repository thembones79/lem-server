import { Request, Response, NextFunction } from "express";
import { Order } from "../../models/order";

export const getAllOrderNumbers = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  Order.find({}, "orderNumber ")
    .distinct("orderNumber")
    .exec(function (err, orders) {
      if (err) {
        return next(err);
      }

      res.json({
        orders,
      });
    });
};
