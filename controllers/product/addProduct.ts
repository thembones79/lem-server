import { Request, Response, NextFunction } from "express";
import { Product } from "../../models/product";

export const addProduct = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  let { partNumber } = req.body;

  if (!partNumber) {
    res.status(422).send({
      error: "You must provide part number!",
    });
    return;
  }

  partNumber = partNumber.trim();

  Product.findOne({ partNumber }, function (err, existingProduct) {
    if (err) {
      return next(err);
    }

    if (existingProduct) {
      return res.status(422).send({ error: "Product already exists!" });
    }

    const product = new Product({
      partNumber,
      linksToDocs: [],
      linksToRedirs: [],
    });

    product.save(function (err) {
      if (err) {
        return next(err);
      }

      res.json({
        product,
      });
    });
  });
};
