import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { OrderStatistics } from "../../models/orderStatistics";

const ObjectId = Types.ObjectId;

export const getOneOrderStats = function (
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

  OrderStatistics.findById(_id).exec(function (err, existingOrderStats) {
    if (err) {
      console.log({ err });
      return next(err);
    }

    if (!existingOrderStats) {
      return res.status(422).send({ error: "Order stats does not exist!" });
    }
    res.json({ existingOrderStats });
  });
};
