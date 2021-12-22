import { Request, Response, NextFunction } from "express";
import { ProductStatistics } from "../../models/productStatistics";

export const getAllProductsStats = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  ProductStatistics.find({}, function (err, productsStats) {
    if (err) {
      return next(err);
    }

    res.json({
      productsStats,
    });
  });
};
