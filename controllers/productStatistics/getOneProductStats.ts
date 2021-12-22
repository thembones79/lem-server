import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { ProductStatistics } from "../../models/productStatistics";

const ObjectId = Types.ObjectId;

export const getOneProductStats = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { _id } = req.params;

  if (!_id) {
    res.status(422).send({
      error: "You must provide product id!",
    });
    return;
  }

  if (!ObjectId.isValid(_id)) {
    res.status(422).send({
      error: "Invalid id!",
    });
    return;
  }

  ProductStatistics.findById(_id).exec(function (err, existingProductStats) {
    if (err) {
      console.log({ err });
      return next(err);
    }

    if (!existingProductStats) {
      return res.status(422).send({ error: "Product stats does not exist!" });
    }
    res.json({ existingProductStats });
  });
};
