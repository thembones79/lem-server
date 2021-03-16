import { Request, Response, NextFunction } from "express";
import { Product } from "../../models/product";

export const getProducts = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  Product.find({}, "partNumber", function (err, products) {
    if (err) {
      return next(err);
    }

    res.json({ products });
  });
};
