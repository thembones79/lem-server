import mongoose from "mongoose";
import { Router, Request, Response, NextFunction } from "express";
import ioserver, { Socket, ServerOptions, Server } from "socket.io";
import { Order } from "../models/order";
import { Line } from "../models/line";

const watchChangeOnOrderCollection = (socket: Socket) => {
  Order.watch().on("change", () => getLiveViewSockets(socket));
};

export const databaseWatcher = function (socket: Socket, next: NextFunction) {
  try {
    watchChangeOnOrderCollection(socket);
    Order.watch().on("error", () => watchChangeOnOrderCollection(socket));
  } catch (error) {
    return console.log(error);
  }
};

export const getLiveView = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  Line.find({}, function (err, lines) {
    if (err) {
      return next(err);
    }
    const filteredLines = lines.filter((line) => line.lineOccupiedWith !== "");

    const orderNumbers = filteredLines.map((line) => {
      return { orderNumber: line.lineOccupiedWith };
    });

    Order.find(
      {
        $or: orderNumbers,
      },
      function (err, orders) {
        if (err) {
          return next(err);
        }

        const liveView = filteredLines.map((line) => {
          const { lineDescription, lineOccupiedWith, lineStatus, _id } = line;
          const existingOrder = orders.filter(
            (order) => order.orderNumber === lineOccupiedWith
          );

          if (!existingOrder[0]) {
            return {
              orderNumber: lineOccupiedWith,
              lineDescription,
              lineOccupiedWith,
              lineStatus,
              _id,
              orderStatus: "not started",
              partNumber: "",
              tactTime: "00:00:00",
              meanCycleTime: "00:00:00",
              lastCycleTime: "00:00:00",
              efficiency: "0%",
              quantity: 0,
              orderAddedAt: 0,
              validScans: 0,
            };
          }

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
          } = existingOrder[0];

          const concatenateZeroIfLessThanTen = (number: number) => {
            return number < 10 ? "0" + number : number + "";
          };

          const renderTime = (time: number) => {
            if (!time) {
              return;
            }
            const localTime = new Date(time);
            const year = concatenateZeroIfLessThanTen(localTime.getFullYear());
            const month = concatenateZeroIfLessThanTen(
              localTime.getMonth() + 1
            );
            const day = concatenateZeroIfLessThanTen(localTime.getDate());
            const hours = concatenateZeroIfLessThanTen(localTime.getHours());
            const minutes = concatenateZeroIfLessThanTen(
              localTime.getMinutes()
            );
            const seconds = concatenateZeroIfLessThanTen(
              localTime.getSeconds()
            );

            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
          };

          const millisToHhMmSs = (millis: number) => {
            if (!millis) {
              return 0;
            }
            return new Date(millis).toISOString().substr(11, 8);
          };

          const isOrderRunning = () => {
            if (!breaks) return false;

            if (breaks.length > 0 && breaks[breaks.length - 1].breakEnd) {
              return true;
            }
            return false;
          };

          const getExactOrderStatus = () => {
            if (orderStatus === "closed") return orderStatus;
            if (isOrderRunning()) return "in progress";
            return "paused";
          };

          const validScans =
            (scans &&
              scans.filter(
                (scan) => scan.errorCode === "e000" || scan.errorCode === "e004"
              )) ||
            [];

          const duplicatedScans =
            (scans && scans.filter((scan) => scan.errorCode === "e001")) || [];

          const wrongCodeScans =
            (scans && scans.filter((scan) => scan.errorCode === "e003")) || [];

          const newestScan =
            validScans.length > 0
              ? new Date(validScans[0].timeStamp).getTime()
              : 0;

          const secondNewestScan =
            validScans.length > 1
              ? new Date(validScans[1].timeStamp).getTime()
              : 0;

          const lastCycleTimeInMilliseconds =
            newestScan > 0 && secondNewestScan > 0
              ? newestScan - secondNewestScan
              : 0;

          const lastCycleTime = millisToHhMmSs(lastCycleTimeInMilliseconds);

          const orderStart = new Date(orderAddedAt!).getTime();

          const grossDurationInMilliseconds = newestScan - orderStart;

          const finishedBreaks =
            (breaks && breaks.filter((item) => item.breakEnd)) || [];
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
                )
              : 0;

          const estimatedDurationInMilliseconds =
            meanCycleTimeInMilliseconds * quantity;

          const estimatedDuration = millisToHhMmSs(
            estimatedDurationInMilliseconds
          );

          const orderAddedAtProcessed = millisToHhMmSs(orderStart);
          const lastScan = millisToHhMmSs(newestScan);

          const estimatedCompletionTime = renderTime(
            orderStart + estimatedDurationInMilliseconds
          );

          const realCompletionTime =
            orderStatus === "closed"
              ? renderTime(newestScan)
              : "not finished yet";

          return {
            lineDescription,
            lineOccupiedWith,
            lineStatus,
            _id,
            orderStatus: getExactOrderStatus(),
            orderNumber,
            orderAddedAt,
            orderAddedAtProcessed,
            lastScan,
            quantity,
            partNumber,
            customer,
            tactTime: tactTime ? millisToHhMmSs(tactTime * 1000) : 0,
            breaks: (breaks && breaks.length) || 0,
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
            meanCycleTimeInMilliseconds,
            lastCycleTime,
            lastCycleTimeInMilliseconds,
            efficiency,
            estimatedDuration,
            estimatedCompletionTime,
            realCompletionTime,
          };
        });
        console.log("************************");
        console.log({ liveView });
        console.log("************************");
        res.json({
          liveView,
        });
      }
    );
  });
};

const getLiveViewSockets = function (socket: Socket) {
  Line.find({}, function (err, lines) {
    if (err) {
      return [];
    }
    const filteredLines = lines.filter((line) => line.lineOccupiedWith !== "");
    const orderNumbers = filteredLines.map((line) => {
      return { orderNumber: line.lineOccupiedWith };
    });

    Order.find(
      {
        $or: orderNumbers,
      },
      function (err, orders) {
        if (err) {
          return [];
        }

        const liveView = filteredLines.map((line) => {
          const { lineDescription, lineOccupiedWith, lineStatus, _id } = line;
          const existingOrder = orders.filter(
            (order) => order.orderNumber === lineOccupiedWith
          );
          if (!existingOrder[0]) {
            return {
              orderNumber: lineOccupiedWith,
              lineDescription,
              lineOccupiedWith,
              lineStatus,
              _id,
              orderStatus: "not started",
              partNumber: "",
              tactTime: 0,
              meanCycleTime: 0,
              lastCycleTime: 0,
              efficiency: 0,
              quantity: 0,
              validScans: 0,
            };
          }

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
          } = existingOrder[0];

          const concatenateZeroIfLessThanTen = (number: number) => {
            return number < 10 ? "0" + number : number + "";
          };

          const renderTime = (time: number) => {
            if (!time) {
              return;
            }
            const localTime = new Date(time);
            const year = concatenateZeroIfLessThanTen(localTime.getFullYear());
            const month = concatenateZeroIfLessThanTen(
              localTime.getMonth() + 1
            );
            const day = concatenateZeroIfLessThanTen(localTime.getDate());
            const hours = concatenateZeroIfLessThanTen(localTime.getHours());
            const minutes = concatenateZeroIfLessThanTen(
              localTime.getMinutes()
            );
            const seconds = concatenateZeroIfLessThanTen(
              localTime.getSeconds()
            );

            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
          };

          const millisToHhMmSs = (millis: number) => {
            if (!millis) {
              return 0;
            }
            return new Date(millis).toISOString().substr(11, 8);
          };

          const isOrderRunning = () => {
            if (!breaks) return false;

            if (breaks.length > 0 && breaks[breaks.length - 1].breakEnd) {
              return true;
            }
            return false;
          };

          const getExactOrderStatus = () => {
            if (orderStatus === "closed") return orderStatus;
            if (isOrderRunning()) return "in progress";
            return "paused";
          };

          const validScans =
            (scans &&
              scans.filter(
                (scan) => scan.errorCode === "e000" || scan.errorCode === "e004"
              )) ||
            [];

          const duplicatedScans =
            (scans && scans.filter((scan) => scan.errorCode === "e001")) || [];

          const wrongCodeScans =
            (scans && scans.filter((scan) => scan.errorCode === "e003")) || [];

          const newestScan =
            validScans.length > 0
              ? new Date(validScans[0].timeStamp).getTime()
              : 0;

          const secondNewestScan =
            validScans.length > 1
              ? new Date(validScans[1].timeStamp).getTime()
              : 0;

          const lastCycleTimeInMilliseconds =
            newestScan > 0 && secondNewestScan > 0
              ? newestScan - secondNewestScan
              : 0;

          const lastCycleTime = millisToHhMmSs(lastCycleTimeInMilliseconds);

          const orderStart = new Date(orderAddedAt).getTime();

          const grossDurationInMilliseconds = newestScan - orderStart;

          const finishedBreaks =
            (breaks && breaks.filter((item) => item.breakEnd)) || [];
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
                )
              : 0;

          const estimatedDurationInMilliseconds =
            meanCycleTimeInMilliseconds * quantity;

          const estimatedDuration = millisToHhMmSs(
            estimatedDurationInMilliseconds
          );

          const orderAddedAtProcessed = renderTime(orderStart);
          const lastScan = renderTime(newestScan);

          const estimatedCompletionTime = renderTime(
            orderStart + estimatedDurationInMilliseconds
          );

          const realCompletionTime =
            orderStatus === "closed"
              ? renderTime(newestScan)
              : "not finished yet";

          return {
            lineDescription,
            lineOccupiedWith,
            lineStatus,
            _id,
            orderStatus: getExactOrderStatus(),
            orderNumber,
            orderAddedAt,
            orderAddedAtProcessed,
            newestScan,
            lastScan,
            quantity,
            partNumber,
            customer,
            tactTime: tactTime ? millisToHhMmSs(tactTime * 1000) : 0,
            breaks: (breaks && breaks.length) || 0,
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
            meanCycleTimeInMilliseconds,
            meanCycleTime,
            lastCycleTimeInMilliseconds,
            lastCycleTime,
            efficiency,
            estimatedDuration,
            estimatedCompletionTime,
            realCompletionTime,
          };
        });
        console.log("************************");
        console.log({ liveView });
        console.log("************************");
        socket.emit("LiveView", { liveView });
      }
    );
  });
};
