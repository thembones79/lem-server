import { Request, Response, NextFunction } from "express";
import { Order } from "../../models/order";
import { getOrderDetails } from "../../services/getOrderDetails";
import { Line } from "../../models/line";
import { addOrUpdateOneOrderStatistics } from "./addOrUpdateOneOrderStatistics";

export const batchAddAllOrdersStats = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  Line.find({}, async function (err, lines) {
    if (err) {
      return next(err);
    }

    try {
      Order.find({}, "orderNumber ")
        .distinct("orderNumber")
        .exec(async (err, orderNumbers) => {
          if (err) {
            return console.log(err);
          }

          if (!orderNumbers) {
            return res
              .status(422)
              .send({ error: "Order numbers array not provided" });
          }

          for (let i = 0; i < orderNumbers.length; i++) {
            const orderNumber = orderNumbers[i];

            await Order.findOne(
              { orderNumber: orderNumber },
              async function (err, existingOrder) {
                if (err) {
                  return next(err);
                }

                if (!existingOrder) {
                  return res
                    .status(422)
                    .send({ error: "Order does not exist" });
                }

                existingOrder.save(async function (err) {
                  if (err) {
                    return next(err);
                  }

                  const orderDetails = getOrderDetails(existingOrder, lines);

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
                    meanCycleTimeInMilliseconds,
                    meanHourlyRate,
                    meanGrossHourlyRate,
                    givenHourlyRate,
                    givenTactTime,
                    xlsxTactTime,
                  } = orderDetails;
                  const orderStats = await addOrUpdateOneOrderStatistics({
                    orderNumber,
                    _orderId: _id,
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
                    meanCycleTimeInMilliseconds: meanCycleTimeInMilliseconds(),
                    meanHourlyRate: meanHourlyRate(),
                    meanGrossHourlyRate: meanGrossHourlyRate(),
                    givenHourlyRate,
                    givenTactTime,
                    xlsxTactTime,
                  });
                  console.log(
                    `${orderNumber} is ${i + 1} of ${orderNumbers.length}`
                  );
                });
              }
            );
          }
        });
    } catch (error) {
      console.log({ error });
    }

    const message = `All done!`;
    res.json({ message });
  });
};
