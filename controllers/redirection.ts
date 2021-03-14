import { Router, Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { SHAREPOINT_PATH, FILE_EXTENSION } from "../config/config";
import { Product } from "../models/product";
import { Redirection } from "../models/redirection";

const ObjectId = Types.ObjectId;

export const addRedirection = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  let { redirRoute, description, fileName } = req.body;

  redirRoute = redirRoute.trim();
  description = description.trim();
  fileName = fileName.trim();

  if (!description || !redirRoute || !fileName) {
    res.status(422).send({
      error: "You must provide description, redirection route and file name!",
    });
    return;
  }
  const targetUrl = SHAREPOINT_PATH + fileName + FILE_EXTENSION;

  Redirection.findOne({ redirRoute }, function (err, existingRedirection) {
    if (err) {
      return next(err);
    }

    if (existingRedirection) {
      return res.status(422).send({ error: "Redirection already defined!" });
    }

    const redirection = new Redirection({
      description,
      redirRoute,
      targetUrl,
      fileName,
    });

    redirection.save(function (err) {
      if (err) {
        return next(err);
      }

      res.json({
        redirection,
      });
    });
  });
};

export const redirectTo = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  let redirRoute = req.params.redirRoute;

  if (!redirRoute) {
    res.status(422).send({
      error: "You must provide redirection route!",
    });
    return;
  }

  redirRoute = redirRoute.trim();

  Redirection.findOne({ redirRoute }, function (err, existingRedirection) {
    if (err) {
      return next(err);
    }

    if (!existingRedirection) {
      return res.status(422).send({ error: "Redirection not defined!" });
    }

    const { targetUrl } = existingRedirection;

    res.redirect(targetUrl);
  });
};

export const changeRedirection = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const _id = req.params._id;
  let { redirRoute, description, fileName } = req.body;

  redirRoute = redirRoute.trim();
  description = description.trim();
  fileName = fileName.trim();

  if (!_id) {
    res.status(422).send({
      error: "You must provide id!",
    });
    return;
  }

  if (!description || !redirRoute || !fileName) {
    res.status(422).send({
      error: "You must provide description, redirection route and file name!",
    });
    return;
  }

  Redirection.findOne({ redirRoute }, function (err, anotherRedirection) {
    if (err) {
      return next(err);
    }

    if (anotherRedirection && anotherRedirection._id != _id) {
      return res.status(422).send({ error: "Route already defined!" });
    }

    const targetUrl = SHAREPOINT_PATH + fileName + FILE_EXTENSION;

    Redirection.findOne({ _id }, function (err, existingRedirection) {
      if (err) {
        return next(err);
      }

      if (!existingRedirection) {
        return res.status(422).send({ error: "No redirection found!" });
      }

      existingRedirection.description = description;
      existingRedirection.redirRoute = redirRoute;
      existingRedirection.targetUrl = targetUrl;
      existingRedirection.fileName = fileName;

      existingRedirection.save(function (err) {
        if (err) {
          return next(err);
        }

        res.json(existingRedirection);
      });
    });
  });
};

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
