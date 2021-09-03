import { OrderDoc } from "../models/order";
import { millisToHhMmSs } from "./millisToHhMmSs";
import { getValidScans } from "./getValidScans";
import { getNetDurationInMilliseconds } from "./getNetDurationInMilliseconds";

export const getMeanCycleTime = (order: OrderDoc) => {
  const { scans } = order;

  const validScans = getValidScans(scans);

  const netDurationInMilliseconds = getNetDurationInMilliseconds(order);

  const meanCycleTimeInMilliseconds =
    validScans.length > 0 && netDurationInMilliseconds > 0
      ? Math.floor(netDurationInMilliseconds / validScans.length)
      : 0;

  return millisToHhMmSs(meanCycleTimeInMilliseconds);
};
