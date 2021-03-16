import { Request, Response, NextFunction } from "express";
import { SHAREPOINT_PATH, FILE_EXTENSION } from "../../config/config";
import { Product } from "../../models/product";

export const addLink = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  let { partNumber, description, fileName } = req.body;

  if (!partNumber || !description || !fileName) {
    res.status(422).send({
      error: "You must provide part number, link description and file name!",
    });
    return;
  }

  partNumber = partNumber.trim();
  description = description.trim();
  fileName = fileName.trim();

  const url = SHAREPOINT_PATH + fileName + FILE_EXTENSION;

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

      let { linksToDocs } = existingProduct;
      linksToDocs.push({ description, url, fileName });

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
