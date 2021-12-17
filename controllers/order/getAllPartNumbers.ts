import { Request, Response, NextFunction } from "express";
import { Order } from "../../models/order";

export const getAllPartNumbers = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  Order.find({}, "partNumber ")
    .distinct("partNumber")
    .exec(function (err, pns) {
      if (err) {
        return next(err);
      }

      res.json({
        pns,
      });
    });
};
