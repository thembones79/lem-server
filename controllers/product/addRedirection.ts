import { Request, Response, NextFunction } from "express";
import { Product } from "../../models/product";

export const addRedirection = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  let { partNumber, _redirection } = req.body;

  if (!partNumber || !_redirection) {
    res.status(422).send({
      error: "You must provide part number and redirection id!",
    });
    return;
  }

  partNumber = partNumber.trim();

  Product.findOne({ partNumber })
    .populate("linksToRedirs")
    .exec(async function (err, existingProduct) {
      if (err) {
        console.log({ err });
        return next(err);
      }

      if (!existingProduct) {
        return res.status(422).send({ error: "Product does not exist!" });
      }

      const { linksToRedirs } = existingProduct;
      linksToRedirs.push(_redirection);

      try {
        await existingProduct.save(function (err) {
          if (err) {
            console.log({ err });
            res.status(400).send("Error");
            return next(new Error("save error"));
          }

          res.json({
            existingProduct,
          });
        });
      } catch (error) {
        console.log({ error });
        next(error);
        return;
      }
    });
};
