import { Request, Response, NextFunction } from "express";
import { Product } from "../../models/product";

export const changeProduct = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  let { partNumber, linksToDocs, linksToRedirs } = req.body;

  if (!partNumber || !linksToDocs || !linksToRedirs) {
    res.status(422).send({
      error: "You must provide part number, link array and redirection array!",
    });
    return;
  }

  if (!Array.isArray(linksToDocs) || !Array.isArray(linksToRedirs)) {
    res.status(422).send({
      error: "linksToDocs and linksToRedirs have to be arrays!",
    });
    return;
  }

  partNumber = partNumber.trim();

  Product.findOne({ partNumber })
    .populate("linksToRedirs")
    .exec(function (err, existingProduct) {
      if (err) {
        console.log({ err });
        return next(err);
      }

      if (!existingProduct) {
        return res.status(422).send({ error: "Product does not exist!" });
      }

      existingProduct.linksToDocs = linksToDocs;
      existingProduct.linksToRedirs = linksToRedirs;

      existingProduct.save(function (err) {
        if (err) {
          return next(err);
        }

        res.json({
          existingProduct,
        });
      });
    });
};
