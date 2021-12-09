import { Request, Response, NextFunction } from "express";
import { PartnumberConfig } from "../../models/partnumberConfig";

export const updatePartNumberConfig = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { sourceOftruth, computationsBase, whatToShow } = req.body;

  PartnumberConfig.findOne({}, function (err, existingConfig) {
    if (err) {
      return next(err);
    }

    if (!existingConfig) {
      res.status(422).send({ error: "Config does not exist!" });
      return;
    }

    if (sourceOftruth) {
      existingConfig.sourceOftruth = sourceOftruth;
    }

    if (computationsBase) {
      existingConfig.computationsBase = computationsBase;
    }

    if (whatToShow) {
      existingConfig.whatToShow = whatToShow;
    }

    existingConfig.save(function (err) {
      if (err) {
        return next(err);
      }
      res.json({
        existingConfig,
      });
    });
  });
};
