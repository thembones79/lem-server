import { Request, Response, NextFunction } from "express";
import { Order } from "../../models/order";
import { Line } from "../../models/line";
import { getOrderDetails } from "../../services/getOrderDetails";

export const getOrdersWithStats = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  Line.find({}, function (err, lines) {
    if (err) {
      return next(err);
    }
    Order.find({}, function (err, orders) {
      if (err) {
        return next(err);
      }

      const ordersWithStats = orders.map((order) => {
        const {
          orderNumber,
          _id,
          partNumber,
          orderStatus,
          quantity,
          orderAddedAt,
          lastValidScan,
          scansAlready,
          validScans,
          linesUsed,
        } = getOrderDetails(order, lines);

        return {
          orderNumber,
          _id,
          partNumber,
          orderStatus,
          quantity,
          orderAddedAt,
          lastValidScan,
          scansAlready,
          validScans,
          linesUsed,
        };
      });

      res.json(ordersWithStats);
    });
  });
};
