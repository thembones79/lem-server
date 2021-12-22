import { Request, Response, NextFunction } from "express";
import { OrderStatistics } from "../../models/orderStatistics";

export const getAllOrdersStats = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  OrderStatistics.find({}, function (err, ordersStats) {
    if (err) {
      return next(err);
    }

    res.json({
      ordersStats,
    });
  });
};
