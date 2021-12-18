import {
  OrderStatistics,
  OrderStatisticsAttrs,
} from "../../models/orderStatistics";
import { getSuggestedTimesForPartnumber } from "./getSuggestedTimesForPartnumber";
import { addOrUpdateOneProductStatistics } from "../productStatistics/addOrUpdateOneProductStatistics";

export const updateOneOrderStatistics = async function ({
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

  await OrderStatistics.findOne(
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

      existingOrderStatistics.save(async function (err) {
        if (err) {
          throw new Error(err);
        }

        console.log({ existingOrderStatistics });
        const statsy2 = await getSuggestedTimesForPartnumber(partNumber);
        console.log({ statsy2 });

        const { suggestedTactTime, suggestedHourlyRate } = statsy2;

        await addOrUpdateOneProductStatistics({
          partNumber,
          xlsxTactTime,
          suggestedHourlyRate,
          suggestedTactTime,
        });

        return {
          existingOrderStatistics,
        };
      });
    }
  );
};
