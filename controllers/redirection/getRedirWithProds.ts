import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { Product } from "../../models/product";
import { Redirection } from "../../models/redirection";

const ObjectId = Types.ObjectId;

export const getRedirWithProds = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const redirId = req.params._id;

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

  Redirection.findOne({ _id: redirId }, function (err, existingRedirection) {
    if (err) {
      return next(err);
    }

    if (!existingRedirection) {
      return res.status(422).send({ error: "Redirection not defined!" });
    }

    Product.find(
      {
        //@ts-ignore
        linksToRedirs: { $in: redirId },
      },
      "partNumber"
    ).exec(function (err, prodsWithThisRedir) {
      if (err) {
        console.log({ err });
        return next(err);
      }

      res.json({ existingRedirection, prodsWithThisRedir });
    });
  });
};
