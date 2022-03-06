import { Request, Response, NextFunction } from "express";
import { Order } from "../../models/order";
import { Line } from "../../models/line";
import { PartnumberConfig } from "../../models/partnumberConfig";
import { getOrderDetails } from "../../services/getOrderDetails";

export const getOrderStats = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const id = req.params.id;

  if (!id) {
    res.status(422).send({
      error: "You have to provide order id!",
    });
    return;
  }

  PartnumberConfig.findOne({}, function (err, partnumberConfig) {
    if (err) {
      return next(err);
    }

    Line.find({}, function (err, lines) {
      if (err) {
        return next(err);
      }
      Order.findById(id, function (err, existingOrder) {
        if (err) {
          return next(err);
        }

        if (!existingOrder) {
          res.status(404).send({
            error: "Order not found!",
          });
          return;
        }

        const {
          orderNumber,
          _id,
          partNumber,
          orderStatus,
          quantity,
          orderAddedAt,
          lastValidScan,
          scansAlready,
          validScans,
          linesUsed,
          netTime,
          meanCycleTime,
          meanHourlyRate,
          meanGrossHourlyRate,
          givenHourlyRate,
          givenTactTime,
          xlsxTactTime,
          hourlyRates,
        } = getOrderDetails(existingOrder, lines);

        res.json({
          orderNumber,
          _id,
          partNumber,
          orderStatus,
          quantity,
          orderAddedAt,
          lastValidScan: lastValidScan(),
          scansAlready: scansAlready(),
          validScans: validScans(),
          linesUsed: linesUsed(),
          netTime: netTime(),
          meanCycleTime: meanCycleTime(),
          meanHourlyRate: meanHourlyRate(),
          meanGrossHourlyRate: meanGrossHourlyRate(),
          givenHourlyRate,
          givenTactTime,
          xlsxTactTime,
          hourlyRates: hourlyRates(),
          computationsBase: partnumberConfig?.computationsBase,
          sourceOftruth: partnumberConfig?.sourceOftruth,
          whatToShow: partnumberConfig?.whatToShow,
        });
      });
    });
  });
};
