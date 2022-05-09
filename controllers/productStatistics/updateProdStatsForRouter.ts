import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { ProductStatistics } from "../../models/productStatistics";

const ObjectId = Types.ObjectId;

export const updateProdStatsForRouter = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { _id } = req.params;

  const {
    givenHourlyRate,
    suggestedHourlyRate,
    givenTactTime,
    suggestedTactTime,
    xlsxTactTime,
    cleanRoomTime,
    automatic,
  } = req.body;

  if (!_id) {
    res.status(422).send({
      error: "You must provide product id!",
    });
    return next();
  }

  if (!ObjectId.isValid(_id)) {
    res.status(422).send({
      error: "Invalid id!!",
    });
    return next();
  }

  ProductStatistics.findById(_id).exec(function (
    err,
    existingProductStatistics
  ) {
    if (err) {
      console.log({ err });
      return next(err);
    }

    if (!existingProductStatistics) {
      return res.status(422).send({ error: "Product stats does not exist!" });
    }

    if (automatic) {
      existingProductStatistics.automatic = automatic;
    }

    if (suggestedHourlyRate) {
      existingProductStatistics.suggestedHourlyRate =
        parseInt(suggestedHourlyRate);
    }

    if (givenHourlyRate) {
      existingProductStatistics.givenHourlyRate = parseInt(givenHourlyRate);
    }

    if (cleanRoomTime) {
      existingProductStatistics.cleanRoomTime = parseInt(cleanRoomTime);
    }

    if (givenTactTime) {
      existingProductStatistics.givenTactTime = parseInt(givenTactTime);
    }

    if (suggestedTactTime) {
      existingProductStatistics.suggestedTactTime = parseInt(suggestedTactTime);
    }

    if (xlsxTactTime) {
      existingProductStatistics.xlsxTactTime = parseInt(xlsxTactTime);
    }

    existingProductStatistics.save(function (err) {
      if (err) {
        return next(err);
      }

      res.json({ existingProductStatistics });
    });
  });
};
