import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { Product } from "../../models/product";

const ObjectId = Types.ObjectId;

export const updateManyProdsWithOneRedir = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const redirId = req.params._id;
  const { productList } = req.body;

  if (!redirId) {
    res.status(422).send({
      error: "You must provide redirection id!",
    });
    return;
  }

  if (!ObjectId.isValid(redirId)) {
    res.status(422).send({
      error: "Invalid id!",
    });
    return;
  }

  if (!productList) {
    res.status(422).send({
      error: "No product list!",
    });
    return;
  }

  if (!Array.isArray(productList)) {
    res.status(422).send({
      error: "product list has to be an array!",
    });
    return;
  }

  Product.updateMany(
    //@ts-ignore
    { linksToRedirs: { $in: redirId } },
    { $pull: { linksToRedirs: redirId } },
    { safe: true, upsert: true },
    function (err, docs) {
      Product.updateMany(
        { partNumber: { $in: productList } },
        //@ts-ignore
        { $push: { linksToRedirs: redirId } },
        { safe: true, upsert: true },
        function (err, docs) {
          if (err) {
            console.log(err);
          } else {
            const message = `Updated many products with one redirection`;

            res.json({
              message,
            });
          }
        }
      );
    }
  );
};
