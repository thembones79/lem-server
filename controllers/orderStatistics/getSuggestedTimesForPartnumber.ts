// TODO!!!!!!!

import { Request, Response, NextFunction } from "express";
import { Order } from "../../models/order";

export const getSuggestedTimesForPartnumber = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  Order.aggregate(
    [
      {
        $group: { orderNumber: "$orderNumber", average: { $avg: "quantity" } },
      },
    ],
    function (err: any, orders: any) {
      if (err) {
        return next(err);
      }

      res.json({
        orders,
      });
    }
  );
};
