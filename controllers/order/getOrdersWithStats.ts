import { Request, Response, NextFunction } from "express";
import { Schema } from "mongoose";
import { Order } from "../../models/order";
import { Line } from "../../models/line";
import { removeDuplicates } from "../../services/removeDuplicates";

export const getOrdersWithStats = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  Line.find({}, function (err, lines) {
    if (err) {
      return next(err);
    }
    Order.find({}, function (err, orders) {
      if (err) {
        return next(err);
      }

      const ordersWithStats = orders.map((order) => {
        const {
          orderNumber,
          _id,
          partNumber,
          orderStatus,
          quantity,
          orderAddedAt,
          scans,
        } = order;

        const scansWithoutErrors = scans.filter(
          (scan) => scan.errorCode === "e000" || scan.errorCode === "e004"
        );

        const usedLines = scans.map((scan) => scan._line) as [];

        const uniqueUsedLines = removeDuplicates(usedLines);

        const getLineDescription = (_id: Schema.Types.ObjectId) => {
          const foundLine = lines.filter((line) => {
            return line._id.toString() === _id.toString();
          });

          if (!foundLine.length) {
            return "";
          }
          return foundLine[0].lineDescription;
        };

        const usedLinesDescriptions = uniqueUsedLines
          .map((line) => {
            if (!line) {
              return "";
            }

            return getLineDescription(line);
          })
          .join(", ");

        return {
          orderNumber,
          _id,
          partNumber,
          orderStatus,
          quantity,
          orderAddedAt,
          lastValidScan: scansWithoutErrors[0]
            ? scansWithoutErrors[0].timeStamp
            : "",
          scansAlready: scans.length,
          validScans: scansWithoutErrors.length,
          lines: usedLinesDescriptions,
        };
      });

      res.json(ordersWithStats);
    });
  });
};
