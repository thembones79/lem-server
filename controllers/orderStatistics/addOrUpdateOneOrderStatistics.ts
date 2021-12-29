import {
  OrderStatistics,
  OrderStatisticsAttrs,
} from "../../models/orderStatistics";
import { getSuggestedTimesForPartnumber } from "./getSuggestedTimesForPartnumber";
import { addOrUpdateOneProductStatistics } from "../productStatistics/addOrUpdateOneProductStatistics";

export const addOrUpdateOneOrderStatistics = async function ({
  _orderId,
  lastValidScan,
  scansAlready,
  validScans,
  linesUsed,
  netTime,
  meanCycleTimeInMilliseconds,
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

  let vvvvvv = await OrderStatistics.findOne(
    { orderNumber },
    async function (err, existingOrderStatistics) {
      if (err) {
        throw new Error(err);
      }

      if (!existingOrderStatistics) {
        const orderStatistics = new OrderStatistics(stats);

        // console.log({ orderStatistics1: orderStatistics });

        orderStatistics.save(async function (err) {
          if (err) {
            throw new Error(err);
          }

          // console.log({ orderStatistics2: orderStatistics });

          const statsy = await getSuggestedTimesForPartnumber(partNumber);
          // console.log({ statsy });

          const { suggestedTactTime, suggestedHourlyRate } = statsy;
          await addOrUpdateOneProductStatistics({
            partNumber,
            suggestedHourlyRate,
            suggestedTactTime,
            xlsxTactTime,
          });

          return {
            orderStatistics,
          };
        });
      } else {
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

        if (meanCycleTimeInMilliseconds) {
          existingOrderStatistics.meanCycleTimeInMilliseconds =
            meanCycleTimeInMilliseconds;
        }

        if (meanHourlyRate) {
          existingOrderStatistics.meanHourlyRate = meanHourlyRate;
        }

        if (orderStatus) {
          existingOrderStatistics.orderStatus = orderStatus;
        }

        if (meanGrossHourlyRate) {
          existingOrderStatistics.meanGrossHourlyRate = meanGrossHourlyRate;
        }

        if (xlsxTactTime) {
          existingOrderStatistics.xlsxTactTime = xlsxTactTime;
        }

        const bvbvbv = await existingOrderStatistics.save(async function (err) {
          if (err) {
            throw new Error(err);
          }

          // console.log({ existingOrderStatistics });
          const statsy2 = await getSuggestedTimesForPartnumber(partNumber);
          console.log({ statsy2 });

          const { suggestedTactTime, suggestedHourlyRate } = statsy2;

          const productStats = await addOrUpdateOneProductStatistics({
            partNumber,
            xlsxTactTime,
            suggestedHourlyRate,
            suggestedTactTime,
          });

          // console.log({ productStats });

          return {
            existingOrderStatistics,
          };
        });

        vvvvvv = bvbvbv;

        return bvbvbv;
      }
    }
  );

  return stats;
};
