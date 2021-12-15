import {
  OrderStatistics,
  OrderStatisticsAttrs,
} from "../../models/orderStatistics";

export const updateOneOrderStatistics = function ({
  _orderId,
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
  orderNumber,
  xlsxTactTime,
  quantity,
  partNumber,
  orderStatus,
  orderAddedAt,
}: OrderStatisticsAttrs): void {
  if (!orderNumber) {
    throw new Error("You must provide order number!");
  }

  OrderStatistics.findOne(
    { orderNumber },
    function (err, existingOrderStatistics) {
      if (err) {
        throw new Error(err);
      }

      if (!existingOrderStatistics) {
        throw new Error("Order does not exist!");
      }

      if (givenHourlyRate) {
        existingOrderStatistics.givenHourlyRate = givenHourlyRate;
      }

      if (givenTactTime) {
        existingOrderStatistics.givenTactTime = givenTactTime;
      }

      if (lastValidScan) {
        existingOrderStatistics.lastValidScan = lastValidScan;
      }

      if (scansAlready) {
        existingOrderStatistics.scansAlready = scansAlready;
      }

      if (validScans) {
        existingOrderStatistics.validScans = validScans;
      }

      if (linesUsed) {
        existingOrderStatistics.linesUsed = linesUsed;
      }

      if (netTime) {
        existingOrderStatistics.netTime = netTime;
      }

      if (meanCycleTime) {
        existingOrderStatistics.meanCycleTime = meanCycleTime;
      }

      if (meanHourlyRate) {
        existingOrderStatistics.meanHourlyRate = meanHourlyRate;
      }

      if (meanGrossHourlyRate) {
        existingOrderStatistics.meanGrossHourlyRate = meanGrossHourlyRate;
      }

      existingOrderStatistics.save(function (err) {
        if (err) {
          throw new Error(err);
        }

        return {
          existingOrderStatistics,
        };
      });
    }
  );
};
