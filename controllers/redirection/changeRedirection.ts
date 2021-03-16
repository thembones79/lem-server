import { Request, Response, NextFunction } from "express";
import { SHAREPOINT_PATH, FILE_EXTENSION } from "../../config/config";
import { Redirection } from "../../models/redirection";

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
