import { OrderDoc } from "../models/order";
import { LineDoc } from "../models/line";
import { getUsedLinesDescriptions } from "./getUsedLinesDescriptions";
import { getNetTime } from "./getNetTime";

export const getOrderDetails = (order: OrderDoc, lines: LineDoc[]) => {
  const orderStats = () => {
    const {
      orderNumber,
      _id,
      partNumber,
      orderStatus,
      quantity,
      orderAddedAt,
      scans,
      breaks,
    } = order;

    const scansWithoutErrors = scans.filter(
      (scan) => scan.errorCode === "e000" || scan.errorCode === "e004"
    );

    const netTime = () => getNetTime(order);

    return {
      orderNumber,
      _id,
      partNumber,
      orderStatus,
      quantity,
      orderAddedAt,
      lastValidScan: scansWithoutErrors[0]
        ? scansWithoutErrors[0].timeStamp
        : "",
      scansAlready: scans.length,
      validScans: scansWithoutErrors.length,
      linesUsed: getUsedLinesDescriptions(scans, lines),
      netTime,
      meanCycleTime: "TODO",
      meanHourlyRate: "TODO",
      standardHourlyRate: "---",
      hourlyRates: [
        {
          date: "2021.12.07",
          hour: "13",
          scansSum: 31,
          scansTimestamps: ["2021.12.07 13:06:22"],
        },
      ],
    };
  };

  return orderStats();
};
