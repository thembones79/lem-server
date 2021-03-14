import { Router, Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { SHAREPOINT_PATH, FILE_EXTENSION } from "../config/config";
import { Product } from "../models/product";

const ObjectId = Types.ObjectId;

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

export const getProducts = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  Product.find({}, "partNumber", function (err, products) {
    if (err) {
      return next(err);
    }

    res.json({ products });
  });
};

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
