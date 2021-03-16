import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { Product } from "../../models/product";

const ObjectId = Types.ObjectId;

export const getProduct = function (
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

  Product.findById(_id)
    .populate("linksToRedirs")
    .exec(function (err, existingProduct) {
      if (err) {
        console.log({ err });
        return next(err);
      }

      if (!existingProduct) {
        return res.status(422).send({ error: "Product does not exist!" });
      }
      res.json({ existingProduct });
    });
};
