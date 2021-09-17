import { OrderDoc } from "../models/order";
import { LineDoc } from "../models/line";
import { getUsedLinesDescriptions } from "./getUsedLinesDescriptions";
import { getNetTime } from "./getNetTime";
import { getMeanCycleTime } from "./getMeanCycleTime";
import { getMeanHourlyRate } from "./getMeanHourlyRate";
import { getMeanGrossHourlyRate } from "./getMeanGrossHourlyRate";
import { getValidScans } from "./getValidScans";
import { getHourlyRates } from "./getHourlyRates";
import { getDate } from "./getDate";

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
    } = order;

    const scansWithoutErrors = getValidScans(scans);
    const netTime = () => getNetTime(order);
    const meanCycleTime = () => getMeanCycleTime(order);
    const meanHourlyRate = () => getMeanHourlyRate(order);
    const meanGrossHourlyRate = () => getMeanGrossHourlyRate(order);
    const hourlyRates = () => getHourlyRates(order, lines);

    return {
      orderNumber,
      _id,
      partNumber,
      orderStatus,
      quantity,
      orderAddedAt: getDate(orderAddedAt),
      lastValidScan: scansWithoutErrors[0]
        ? getDate(scansWithoutErrors[0].timeStamp)
        : "",
      scansAlready: scans.length,
      validScans: scansWithoutErrors.length,
      linesUsed: getUsedLinesDescriptions(scans, lines),
      netTime,
      meanCycleTime,
      meanHourlyRate,
      meanGrossHourlyRate,
      standardHourlyRate: "---",
      hourlyRates,
    };
  };

  return orderStats();
};
