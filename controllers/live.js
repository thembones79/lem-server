const Order = require("../models/order");
const Line = require("../models/line");
const mongoose = require("mongoose");

exports.getLiveView = function (req, res, next) {
  Line.find({}, function (err, lines) {
    if (err) {
      console.log({ lineerr: err });
      return next(err);
    }
    const filteredLines = lines.filter((line) => line.lineOccupiedWith !== "");
    const orderNumbers = filteredLines.map((line) => {
      return { orderNumber: line.lineOccupiedWith };
    });
    console.log("************************");
    console.log({ lines });
    console.log("************************");
    console.log({ filteredLines });
    Order.find(
      {
        $or: orderNumbers,
      },
      function (err, orders) {
        if (err) {
          console.log({ ordererr: err });
          return next(err);
        }
        console.log("************************");
        console.log({ orders });
        const liveView = filteredLines.map((line) => {
          const { lineDescription, lineOccupiedWith, lineStatus, _id } = line;
          const existingOrder = orders.filter(
            (order) => order.orderNumber === lineOccupiedWith
          );
          console.log("************************");
          console.log({ lineDescription, lineOccupiedWith, lineStatus, _id });
          console.log("************************");
          console.log({ existingOrder });
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
          console.log("************************");
          console.log({
            orderStatus,
            orderNumber,
            quantity,
            partNumber,
            customer,
            tactTime,
            breaks,
            scans,
            orderAddedAt,
          });

          const concatenateZeroIfLessThanTen = (number) => {
            return number < 10 ? "0" + number : number;
          };

          const renderTime = (time) => {
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

          const millisToHhMmSs = (millis) => {
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

          const orderStart = new Date(orderAddedAt).getTime();

          const grossDurationInMilliseconds = newestScan - orderStart;

          const finishedBreaks =
            (breaks && breaks.filter((item) => item.breakEnd)) || [];
          const individualBreakTimes = finishedBreaks.map(
            (item) =>
              new Date(item.breakEnd).getTime() -
              new Date(item.breakStart).getTime()
          );
          const arrSum = (arr) => arr.reduce((a, b) => a + b, 0);
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
            meanCycleTimeInMilliseconds > 0
              ? Math.floor(
                  ((tactTime * 1000) / meanCycleTimeInMilliseconds) * 100
                ) + "%"
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
            tactTime: millisToHhMmSs(tactTime * 1000),
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
