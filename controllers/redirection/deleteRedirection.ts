import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { Product } from "../../models/product";
import { Redirection } from "../../models/redirection";

const ObjectId = Types.ObjectId;

export const deleteRedirection = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const _id = req.params._id;

    if (!_id) {
      res.status(422).send({
        error: "You must provide redirection id!",
      });
      return;
    }

    if (!ObjectId.isValid(_id)) {
      res.status(422).send({
        error: "Invalid id!",
      });
      return;
    }

    Product.updateMany(
      //@ts-ignore
      { linksToRedirs: { $in: _id } },
      { $pull: { linksToRedirs: _id } },
      { safe: true, upsert: true },
      function (err, docs) {
        Redirection.findOneAndRemove(
          { _id },
          function (err, existingRedirection) {
            if (err) {
              return next(err);
            } else if (!existingRedirection) {
              return res
                .status(422)
                .send({ error: "Redirection does not exist!" });
            } else {
              const message = `Deleted redirection from /${existingRedirection.redirRoute}`;

              res.json({
                message,
              });
            }
          }
        );
      }
    );
  } catch (error) {
    return next(error);
  }
};

export const getRedirections = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  Redirection.find({}, function (err, redirections) {
    if (err) {
      return next(err);
    }

    res.json({ redirections });
  });
};
