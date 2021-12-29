// TODO!!!!!!!

import { OrderStatistics } from "../../models/orderStatistics";

export const getSuggestedTimesForPartnumber = async function (
  partNumber: string
) {
  const stats = await OrderStatistics.aggregate(
    [
      { $match: { partNumber, validScans: { $gt: 1 } } },
      {
        $group: {
          _id: "$partNumber",
          suggestedTactTime: { $avg: "$meanCycleTimeInMilliseconds" },
          suggestedHourlyRate: { $avg: "$meanHourlyRate" },
          existsInHowManyOrders: { $sum: 1 },
        },
      },
    ],
    function (err: any, pns: any) {
      if (err) {
        console.error(err);
        throw new Error(err);
      }

      return pns;
    }
  );

  if (!stats[0]) {
    console.warn("kupa", { stats });
    return {
      suggestedTactTime: 69,
      suggestedHourlyRate: 69,
      existsInHowManyOrders: 69,
      partNumber,
    };
  }
  const { suggestedTactTime, suggestedHourlyRate, existsInHowManyOrders } =
    stats[0];
  const ttInSeconds = Math.floor(suggestedTactTime / 1000);
  const roundedHr = Math.ceil(suggestedHourlyRate);
  console.log({
    suggestedTactTime: ttInSeconds,
    suggestedHourlyRate: roundedHr,
    existsInHowManyOrders,
    aaa: "bbb",
    partNumber,
  });
  return {
    suggestedTactTime: ttInSeconds,
    suggestedHourlyRate: roundedHr,
    existsInHowManyOrders,
    partNumber,
  };
};
