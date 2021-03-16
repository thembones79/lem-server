import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { Product } from "../../models/product";

const ObjectId = Types.ObjectId;
export const deleteProduct = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const _id = req.params._id;

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

    Product.findByIdAndRemove(_id, function (err, existingProduct) {
      if (err) {
        return next(err);
      } else if (!existingProduct) {
        return res.status(422).send({ error: "Product does not exist!" });
      } else {
        const message = `Deleted ${existingProduct.partNumber}`;

        res.json({
          message,
        });
      }
    });
  } catch (error) {
    return next(error);
  }
};
