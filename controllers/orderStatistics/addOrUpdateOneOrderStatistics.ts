import {
  OrderStatistics,
  OrderStatisticsAttrs,
} from "../../models/orderStatistics";
import { getSuggestedTimesForPartnumber } from "../../services/getSuggestedTimesForPartnumber";
import { addOrUpdateOneProductStatistics } from "../productStatistics/addOrUpdateOneProductStatistics";

export const addOrUpdateOneOrderStatistics = async function (
  stats: OrderStatisticsAttrs
) {
  const {
    orderNumber,
    partNumber,
    xlsxTactTime,
    givenHourlyRate,
    givenTactTime,
    lastValidScan,
    scansAlready,
    validScans,
    linesUsed,
    netTime,
    meanCycleTime,
    meanCycleTimeInMilliseconds,
    meanGrossHourlyRate,
    meanHourlyRate,
    orderStatus,
  } = stats;

  if (!orderNumber) {
    throw new Error("You must provide order number!");
  }

  await OrderStatistics.findOne(
    { orderNumber },
    async function (err, existingOrderStatistics) {
      if (err) {
        throw new Error(err);
      }

      if (!existingOrderStatistics) {
        const orderStatistics = new OrderStatistics(stats);

        orderStatistics.save(async function (err) {
          if (err) {
            throw new Error(err);
          }

          const statsy = await getSuggestedTimesForPartnumber(partNumber);

          const { suggestedTactTime, suggestedHourlyRate } = statsy;
          await addOrUpdateOneProductStatistics({
            partNumber,
            suggestedHourlyRate,
            suggestedTactTime,
            xlsxTactTime,
          });
          console.log({ orderStatistics });
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

        await existingOrderStatistics.save(async function (err) {
          if (err) {
            throw new Error(err);
          }

          const statsy2 = await getSuggestedTimesForPartnumber(partNumber);

          const { suggestedTactTime, suggestedHourlyRate } = statsy2;

          await addOrUpdateOneProductStatistics({
            partNumber,
            xlsxTactTime,
            suggestedHourlyRate,
            suggestedTactTime,
          });
          console.log({ existingOrderStatistics });
          return {
            existingOrderStatistics,
          };
        });
      }
    }
  );

  return stats;
};
