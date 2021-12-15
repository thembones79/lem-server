import { Request, Response, NextFunction } from "express";
import { PartnumberConfig } from "../../models/partnumberConfig";

export const getPartNumberConfig = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  PartnumberConfig.findOne({}, function (err, existingConfig) {
    if (err) {
      return next(err);
    }

    if (!existingConfig) {
      res.status(422).send({ error: "Config does not exist!" });
      return;
    }

    res.json({
      existingConfig,
    });
  });
};
