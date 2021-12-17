import { Request, Response, NextFunction } from "express";
import { Order } from "../../models/order";
import { Line } from "../../models/line";
import { getOrderDetails } from "../../services/getOrderDetails";
import { addOneOrderStatistics } from "../orderStatistics/addOneOrderStatistics";
import { getSuggestedTimesForPartnumber } from "../orderStatistics/getSuggestedTimesForPartnumber";

export const addOrder = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const orderNumber = req.body.orderNumber;
  const quantity = req.body.quantity;
  const partNumber = req.body.partNumber;
  const qrCode = req.body.qrCode;
  const tactTime = req.body.tactTime || 36000; // 10 hours
  const customer = req.body.customer;
  const orderStatus = "open";

  if (
    !orderNumber ||
    !quantity ||
    !partNumber ||
    !qrCode ||
    !tactTime ||
    !customer
  ) {
    res.status(422).send({
      error: "Not enough values!",
    });
    return;
  }
  Line.find({}, function (err, lines) {
    if (err) {
      return next(err);
    }

    Order.findOne({ orderNumber: orderNumber }, function (err, existingOrder) {
      if (err) {
        return next(err);
      }

      if (existingOrder) {
        return res.status(422).send({ error: "Order exists" });
      }

      const order = new Order({
        orderNumber,
        quantity,
        partNumber,
        qrCode,
        customer,
        tactTime,
        orderStatus,
        breaks: [],
        scans: [],
      });

      order.save(function (err) {
        if (err) {
          return next(err);
        }

        async function handleStatistics() {
          const orderDetails = await getOrderDetails(order, lines);

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
          } = orderDetails;
          console.log({ orderDetails });
          const orderStats = await addOneOrderStatistics({
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
            meanHourlyRate: meanHourlyRate(),
            meanGrossHourlyRate: meanGrossHourlyRate(),
            givenHourlyRate,
            givenTactTime,
            xlsxTactTime,
          });
          await console.log({ orderStats });
          await getSuggestedTimesForPartnumber();

          await res.json({
            orderStats,
            order,
          });
        }

        handleStatistics();
      });
    });
  });
};
