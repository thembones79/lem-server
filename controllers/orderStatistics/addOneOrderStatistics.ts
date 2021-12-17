import {
  OrderStatistics,
  OrderStatisticsAttrs,
} from "../../models/orderStatistics";

export const addOneOrderStatistics = function ({
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

  orderNumber = orderNumber.trim();

  OrderStatistics.findOne(
    { orderNumber },
    function (err, existingOrderStatistics) {
      if (err) {
        console.error(err);
        throw new Error(err);
      }

      if (existingOrderStatistics) {
        console.warn("EXISTS");
        throw new Error("Order already exists!");
      }

      const orderStatistics = new OrderStatistics({
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
      });

      console.log({ orderStatistics1: orderStatistics });

      orderStatistics.save(function (err) {
        if (err) {
          throw new Error(err);
        }

        console.log({ orderStatistics2: orderStatistics });

        return {
          orderStatistics,
        };
      });
    }
  );
};
