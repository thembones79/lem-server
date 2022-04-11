import { Request, Response, NextFunction } from "express";
import { Order } from "../../models/order";
import { Scan } from "../../models/scan";
import { Break } from "../../models/break";
import { Line } from "../../models/line";
import { getOrderDetails } from "../../services/getOrderDetails";
import { addOrUpdateOneOrderStatistics } from "../orderStatistics";

export const addScan = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const orderNumber = req.body.orderNumber;
  const scanContent: string = req.body.scanContent;
  let errorCode = req.body.errorCode || "e000";
  const _line = req.body._line;
  const _user = req.body._user;

  if (!orderNumber || !scanContent || !errorCode || !_line || !_user) {
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

      if (!existingOrder) {
        return res.status(422).send({ error: "Order does not exist" });
      }

      const {
        quantity,
        partNumber,
        qrCode,
        customer,
        tactTime,
        orderStatus,
        breaks,
        scans,
      } = existingOrder;

      if (orderStatus === "closed") {
        return res.status(422).send({ error: "Order is completed" });
      }

      // checks for double scans
      scans.forEach((element) => {
        if (element.scanContent === scanContent) {
          errorCode = "e001";
        }
      });

      // checks if scan's serial number is in the quantity range
      const serialNumber = parseInt(scanContent.substr(-5)) || 0;
      if (serialNumber < 1 || serialNumber > quantity) {
        errorCode = "e002";
      }

      // checks if scan consists valid QR code
      const qrCodeFromScan = scanContent.substr(0, scanContent.length - 17);
      const qrCodeWithoutDate = qrCode.substr(0, qrCode.length - 12);
      if (qrCodeWithoutDate !== qrCodeFromScan) {
        errorCode = "e003";
      }
      const scansWithoutErrors = scans.filter(
        (scan) => scan.errorCode === "e000" || scan.errorCode === "e004"
      );
      // checks if scan is first then if this scan is 00001
      if (
        scansWithoutErrors.length === 0 &&
        serialNumber !== 1 &&
        errorCode !== "e003"
      ) {
        errorCode = "e004";
      }

      // if scan is not first then if scan code equals first scan in the array + 1
      if (scansWithoutErrors.length > 0) {
        const previousScanCode = parseInt(
          scansWithoutErrors[0].scanContent.substr(-5)
        );
        if (
          errorCode !== "e003" &&
          errorCode !== "e001" &&
          serialNumber !== previousScanCode + 1
        ) {
          errorCode = "e004";
        }
      }

      const scan = new Scan({
        scanContent,
        errorCode,
        _line,
        _user,
      });

      scans.unshift(scan);
      const updatedScansLength = scans.filter(
        (scan) => scan.errorCode === "e000" || scan.errorCode === "e004"
      ).length;
      if (quantity === updatedScansLength && orderStatus === "open") {
        const breakStart = new Date();
        const newBreak = new Break({
          breakStart,
          _line,
        });
        breaks.push(newBreak);
        existingOrder.orderStatus = "closed";
      }
      existingOrder.save(async function (err) {
        if (err) {
          return next(err);
        }

        async function handleStatistics() {
          if (!existingOrder) {
            return res.status(422).send({ error: "Order does not exist" });
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
            grossTime,
            absoluteTime,
            meanCycleTime,
            meanCycleTimeInMilliseconds,
            meanHourlyRate,
            meanGrossHourlyRate,
            givenHourlyRate,
            givenTactTime,
            hourlyRates,
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
            grossTime: grossTime(),
            absoluteTime: absoluteTime(),
            meanCycleTime: meanCycleTime(),
            meanCycleTimeInMilliseconds: meanCycleTimeInMilliseconds(),
            meanHourlyRate: meanHourlyRate(),
            meanGrossHourlyRate: meanGrossHourlyRate(),
            givenHourlyRate,
            givenTactTime,
            xlsxTactTime,
          });

          await res.json({
            orderStats,
            existingOrder,
            hourlyRates: hourlyRates(),
          });
        }

        await handleStatistics();
      });
    });
  });
};
