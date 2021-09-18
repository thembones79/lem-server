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
    const scansAlready = () => scans.length;
    const validScans = () => scansWithoutErrors.length;
    const linesUsed = () => getUsedLinesDescriptions(scans, lines);
    const lastValidScan = () =>
      scansWithoutErrors[0] ? getDate(scansWithoutErrors[0].timeStamp) : "";

    return {
      orderNumber,
      _id,
      partNumber,
      orderStatus,
      quantity,
      orderAddedAt: getDate(orderAddedAt),
      lastValidScan,
      scansAlready,
      validScans,
      linesUsed,
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
