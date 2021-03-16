import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { Order } from "../../models/order";
import { Line, LineAttrs } from "../../models/line";
import { Product } from "../../models/product";

const ObjectId = Types.ObjectId;

export const getProductFromLine = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const _id = req.params._id;
  if (!_id) {
    res.status(422).send({
      error: "You must provide line id!",
    });
    return;
  }

  if (!ObjectId.isValid(_id)) {
    res.status(422).send({
      error: "Invalid id!",
    });
    return;
  }

  Line.findById(_id, function (err: Error, line: LineAttrs) {
    if (err) {
      next(err);
      return;
    }

    if (!line) {
      res.status(422).send({ error: "Line does not exist" });
      return;
    }

    const orderNumber = line.lineOccupiedWith;
    if (!orderNumber || orderNumber === "") {
      res.status(422).send({
        error: "Line is free!",
      });
      return;
    }

    Order.findOne(
      {
        orderNumber,
      },
      function (err, order) {
        if (err) {
          next(err);
          return;
        }
        if (!order) {
          res.status(422).send({ error: "Order does not exist" });
          return;
        }

        const { partNumber } = order;

        Product.findOne({ partNumber })
          .populate("linksToRedirs")
          .exec(function (err, existingProduct) {
            if (err) {
              console.log({ err });
              next(err);
              return;
            }
            if (!existingProduct) {
              res.status(422).send({ error: "Product does not exist!" });
              return;
            }
            res.json({ existingProduct, orderNumber });
          });
      }
    );
  });
};
