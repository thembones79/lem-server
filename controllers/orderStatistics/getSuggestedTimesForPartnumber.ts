// TODO!!!!!!!

import { OrderStatistics } from "../../models/orderStatistics";

export const getSuggestedTimesForPartnumber = function (): void {
  OrderStatistics.aggregate(
    [
      {
        $group: {
          _id: "$partNumber",
          averageMCT: { $avg: "$quantity" },
          averageMHR: { $avg: "$meanHourlyRate" },
        },
      },
    ],
    function (err: any, pns: any) {
      if (err) {
        console.error(err);
        throw new Error(err);
      }
      console.log({ pns });

      return pns;
    }
  );
};
