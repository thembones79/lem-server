import { Request, Response, NextFunction } from "express";
import { SHAREPOINT_PATH, FILE_EXTENSION } from "../../config/config";
import { Redirection } from "../../models/redirection";

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
