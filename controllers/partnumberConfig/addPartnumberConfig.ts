import { Request, Response, NextFunction } from "express";
import { PartnumberConfig } from "../../models/partnumberConfig";

export const addPartNumberConfig = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  PartnumberConfig.findOne({}, function (err, existingConfig) {
    if (err) {
      return next(err);
    }

    const partnumberConfig = new PartnumberConfig({});

    partnumberConfig.save(function (err) {
      if (err) {
        return next(err);
      }
      res.json({
        partnumberConfig,
      });
    });
  });
};
