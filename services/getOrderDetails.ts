import { OrderDoc } from "../models/order";
import { LineDoc } from "../models/line";
import { getUsedLinesDescriptions } from "./getUsedLinesDescriptions";
import { getNetTime } from "./getNetTime";
import { getAbsoluteTime } from "./getAbsoluteTime";
import { getGrossTime } from "./getGrossTime";
import { getMeanCycleTime } from "./getMeanCycleTime";
import { getMeanCycleTimeInMilliseconds } from "./getMeanCycleTimeInMilliseconds";
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
      tactTime,
      quantity,
      orderAddedAt,
      scans,
    } = order;

    const scansWithoutErrors = getValidScans(scans);
    const netTime = () => getNetTime(order);
    const grossTime = () => getGrossTime(order);
    const absoluteTime = () => getAbsoluteTime(order);
    const meanCycleTime = () => getMeanCycleTime(order);
    const meanCycleTimeInMilliseconds = () =>
      getMeanCycleTimeInMilliseconds(order);
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
      grossTime,
      absoluteTime,
      meanCycleTime,
      meanCycleTimeInMilliseconds,
      meanHourlyRate,
      meanGrossHourlyRate,
      givenHourlyRate: 1,
      givenTactTime: 3600,
      xlsxTactTime: tactTime,
      hourlyRates,
    };
  };

  return orderStats();
};
