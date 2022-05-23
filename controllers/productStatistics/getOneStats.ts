import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { ProductStatistics } from "../../models/productStatistics";

const ObjectId = Types.ObjectId;

export const getOneStats = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { partNumber } = req.body;

  ProductStatistics.findOne({ partNumber }).exec(function (
    err,
    existingProductStats
  ) {
    if (err) {
      console.log({ err });
      return next(err);
    }

    if (!existingProductStats) {
      return res.json({ givenTactTime: 3600 });
    }
    res.send({ oneStats: existingProductStats });
  });
};
