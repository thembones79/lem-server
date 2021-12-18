import {
  OrderStatistics,
  OrderStatisticsAttrs,
} from "../../models/orderStatistics";
import { getSuggestedTimesForPartnumber } from "./getSuggestedTimesForPartnumber";
import { addOrUpdateOneProductStatistics } from "../productStatistics/addOrUpdateOneProductStatistics";

export const addOneOrderStatistics = async function ({
  _orderId,
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
  orderNumber,
  xlsxTactTime,
  quantity,
  partNumber,
  orderStatus,
  orderAddedAt,
}: OrderStatisticsAttrs) {
  if (!orderNumber) {
    throw new Error("You must provide order number!");
  }

  const stats = {
    _orderId,
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
    orderNumber,
    xlsxTactTime,
    quantity,
    partNumber,
    orderStatus,
    orderAddedAt,
  };

  await OrderStatistics.findOne(
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

      const orderStatistics = new OrderStatistics(stats);

      console.log({ orderStatistics1: orderStatistics });

      orderStatistics.save(async function (err) {
        if (err) {
          throw new Error(err);
        }

        console.log({ orderStatistics2: orderStatistics });

        const statsy = await getSuggestedTimesForPartnumber(partNumber);
        console.log({ statsy });

        await addOrUpdateOneProductStatistics({ partNumber, xlsxTactTime });

        return {
          orderStatistics,
        };
      });
    }
  );

  return stats;
};
