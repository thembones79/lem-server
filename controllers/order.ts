import { Router, Request, Response, NextFunction } from "express";
import mongoose, { Types } from "mongoose";
import { Order } from "../models/order";

export const addOrder = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const orderNumber = req.body.orderNumber;
  const quantity = req.body.quantity;
  const partNumber = req.body.partNumber;
  const qrCode = req.body.qrCode;
  const tactTime = req.body.tactTime || 36000;
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
      res.json({
        order,
      });
    });
  });
};

export const getOrder = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const orderNumber = req.params.dashedordernumber.replace(/-/g, "/");

  if (!orderNumber) {
    res.status(422).send({
      error: "You have to provide order number!",
    });
    return;
  }
  Order.findOne({ orderNumber: orderNumber }, function (err, existingOrder) {
    if (err) {
      return next(err);
    }

    res.json({
      existingOrder,
    });
  });
};

export const getOrders = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  Order.find({}, function (err, orders) {
    if (err) {
      return next(err);
    }

    res.json({
      orders,
    });
  });
};

export const closeOrder = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const orderNumber = req.body.orderNumber;

    if (!orderNumber) {
      res.status(422).send({
        error: "You must provide order number!",
      });
      return;
    }

    Order.findOne({ orderNumber }, function (err, existingOrder) {
      if (err) {
        return next(err);
      }

      if (!existingOrder) {
        return res.status(422).send({ error: "Order does not exist!" });
      }

      if (existingOrder.orderStatus === "closed") {
        return res.status(422).send({ error: "Order is already closed!" });
      }

      // logic closed in in IF STATEMENT beause there can be other statuses in the future
      if (existingOrder.orderStatus === "open") {
        existingOrder.orderStatus = "closed";
        existingOrder.save(function (err) {
          if (err) {
            return next(err);
          }
          const message = `Updated order no. ${existingOrder.orderNumber} status to: ${existingOrder.orderStatus}`;

          res.json({
            message,
          });
        });
      } else {
        const message = `No changes were added`;

        res.json({
          message,
        });
      }
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteOrder = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const orderNumber = req.params.dashedordernumber.replace(/-/g, "/");

    if (!orderNumber) {
      res.status(422).send({
        error: "You must provide order number!",
      });
      return;
    }

    Order.findOneAndRemove({ orderNumber }, function (err, existingOrder) {
      if (err) {
        return next(err);
      } else if (!existingOrder) {
        return res.status(422).send({ error: "Order does not exist!" });
      } else {
        const message = `Deleted order no. ${existingOrder.orderNumber}`;

        res.json({
          message,
        });
      }
    });
  } catch (error) {
    return next(error);
  }
};

export const getAggregatedOrders = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  Order.find({}, function (err, orders) {
    if (err) {
      return next(err);
    }

    const aggregatedOrders = orders.map((order) => {
      const {
        orderStatus,
        orderNumber,
        quantity,
        partNumber,
        customer,
        tactTime,
        breaks,
        scans,
        orderAddedAt,
      } = order;

      const concatenateZeroIfLessThanTen = (number: number) => {
        return number < 10 ? "0" + number : number;
      };

      const renderTime = (time: number) => {
        if (!time) {
          return;
        }
        const localTime = new Date(time);
        const year = concatenateZeroIfLessThanTen(localTime.getFullYear());
        const month = concatenateZeroIfLessThanTen(localTime.getMonth() + 1);
        const day = concatenateZeroIfLessThanTen(localTime.getDate());
        const hours = concatenateZeroIfLessThanTen(localTime.getHours());
        const minutes = concatenateZeroIfLessThanTen(localTime.getMinutes());
        const seconds = concatenateZeroIfLessThanTen(localTime.getSeconds());

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      };

      const millisToHhMmSs = (millis: number) => {
        if (!millis) {
          return 0;
        }
        return new Date(millis).toISOString().substr(11, 8);
      };

      const isOrderRunning =
        breaks.length > 0
          ? breaks[breaks.length - 1].breakEnd
            ? true
            : false
          : false;

      const getExactOrderStatus = () => {
        if (orderStatus === "closed") return orderStatus;
        if (isOrderRunning) return "in progress";
        return "paused";
      };

      const validScans = scans.filter(
        (scan) => scan.errorCode === "e000" || scan.errorCode === "e004"
      );

      const duplicatedScans = scans.filter((scan) => scan.errorCode === "e001");

      const wrongCodeScans = scans.filter((scan) => scan.errorCode === "e003");

      const newestScan =
        validScans.length > 0 ? new Date(validScans[0].timeStamp).getTime() : 0;

      const orderStart = new Date(orderAddedAt).getTime();

      const grossDurationInMilliseconds = newestScan - orderStart;

      const finishedBreaks = breaks.filter((item) => item.breakEnd);
      const individualBreakTimes = finishedBreaks.map(
        (item) =>
          new Date(item.breakEnd).getTime() -
          new Date(item.breakStart).getTime()
      );
      const arrSum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
      const breakTimesInMilliseconds = arrSum(individualBreakTimes);
      const netDurationInMilliseconds =
        grossDurationInMilliseconds - breakTimesInMilliseconds;

      const grossTimeSoFar = millisToHhMmSs(grossDurationInMilliseconds);
      const netTimeSoFar =
        netDurationInMilliseconds > 0
          ? millisToHhMmSs(netDurationInMilliseconds)
          : 0;
      const breakTime = millisToHhMmSs(breakTimesInMilliseconds);
      const meanCycleTimeInMilliseconds =
        validScans.length > 0 && netDurationInMilliseconds > 0
          ? Math.floor(netDurationInMilliseconds / validScans.length)
          : 0;
      const meanCycleTime = millisToHhMmSs(meanCycleTimeInMilliseconds);

      const efficiency =
        meanCycleTimeInMilliseconds > 0 && tactTime
          ? Math.floor(
              ((tactTime * 1000) / meanCycleTimeInMilliseconds) * 100
            ) + "%"
          : 0;

      const estimatedDurationInMilliseconds =
        meanCycleTimeInMilliseconds * quantity;

      const estimatedDuration = millisToHhMmSs(estimatedDurationInMilliseconds);

      const orderAddedAtProcessed = millisToHhMmSs(orderStart);
      const lastScan = millisToHhMmSs(newestScan);

      const estimatedCompletionTime = renderTime(
        orderStart + estimatedDurationInMilliseconds
      );

      const realCompletionTime =
        orderStatus === "closed" ? renderTime(newestScan) : "not finished yet";

      return {
        orderStatus: getExactOrderStatus(),
        orderNumber,
        orderAddedAt,
        orderAddedAtProcessed,
        lastScan,
        quantity,
        partNumber,
        customer,
        tactTime: tactTime ? millisToHhMmSs(tactTime * 1000) : 0,
        breaks: breaks.length,
        validScans: validScans.length,
        duplicatedScans: duplicatedScans.length,
        wrongCodeScans: wrongCodeScans.length,
        grossTimeSoFar,
        grossDurationInMilliseconds,
        netTimeSoFar,
        netDurationInMilliseconds,
        breakTime,
        breakTimesInMilliseconds,
        finishedBreaks: finishedBreaks.length,
        meanCycleTime,
        efficiency,
        estimatedDuration,
        estimatedCompletionTime,
        realCompletionTime,
      };
    });

    res.json({
      aggregatedOrders,
    });
  });
};

export const getLiveView = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const orderNumber = req.params.dashedordernumber.replace(/-/g, "/");

  if (!orderNumber) {
    res.status(422).send({
      error: "You have to provide order number!",
    });
    return;
  }
  Order.findOne({ orderNumber: orderNumber }, function (err, existingOrder) {
    if (err) {
      return next(err);
    }

    res.json({
      existingOrder,
    });
  });
};
