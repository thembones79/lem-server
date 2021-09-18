import { Request, Response, NextFunction } from "express";
import { Order } from "../../models/order";

export const getOrders = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  Order.find(
    {},
    "orderNumber orderStatus _id quantity partNumber qrCode orderAddedAt customer",
    function (err, orders) {
      if (err) {
        return next(err);
      }

      res.json({
        orders,
      });
    }
  );
};
