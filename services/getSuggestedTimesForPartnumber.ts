import { OrderStatistics } from "../models/orderStatistics";

export const getSuggestedTimesForPartnumber = async function (
  partNumber: string
) {
  const stats = await OrderStatistics.aggregate(
    [
      { $match: { partNumber, meanCycleTimeInMilliseconds: { $gt: 0 } } },
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
    console.warn(
      `Not enough scans for ${partNumber} to generate real stats. Using default values for further processing`
    );
    return {
      suggestedTactTime: 3600,
      suggestedHourlyRate: 1,
      existsInHowManyOrders: 0,
      partNumber,
    };
  }
  const { suggestedTactTime, suggestedHourlyRate, existsInHowManyOrders } =
    stats[0];
  const ttInSeconds = Math.floor(suggestedTactTime / 1000);
  const roundedHr = Math.ceil(suggestedHourlyRate);
  return {
    suggestedTactTime: ttInSeconds,
    suggestedHourlyRate: roundedHr,
    existsInHowManyOrders,
    partNumber,
  };
};
