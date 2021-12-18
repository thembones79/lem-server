// TODO!!!!!!!

import { OrderStatistics } from "../../models/orderStatistics";

export const getSuggestedTimesForPartnumber = async function (
  partNumber: string
) {
  const stats = await OrderStatistics.aggregate(
    [
      { $match: { partNumber } },
      {
        $group: {
          _id: "$partNumber",
          suggestedTactTime: { $avg: "$meanCycleTimeInMilliseconds" },
          suggestedHourlyRate: { $avg: "$meanHourlyRate" },
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
    return { suggestedTactTime: 69, suggestedHourlyRate: 69 };
  }
  const { suggestedTactTime, suggestedHourlyRate } = stats[0];
  console.log({ suggestedTactTime, suggestedHourlyRate, aaa: "bbb" });
  return { suggestedTactTime, suggestedHourlyRate };
};
