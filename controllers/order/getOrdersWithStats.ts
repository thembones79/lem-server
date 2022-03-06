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
    Order.find(
      {},
      "orderNumber orderStatus _id quantity partNumber qrCode orderAddedAt customer",
      function (err, orders) {
        if (err) {
          return next(err);
        }

        const ordersWithStats = orders.map(async (order) => {
          const {
            orderNumber,
            _id,
            partNumber,
            orderStatus,
            quantity,
            orderAddedAt,
          } = await getOrderDetails(order, lines);

          return {
            orderNumber,
            _id,
            partNumber,
            orderStatus,
            quantity,
            orderAddedAt,
          };
        });

        res.json(ordersWithStats);
      }
    ).sort({ orderAddedAt: -1 });
  });
};
