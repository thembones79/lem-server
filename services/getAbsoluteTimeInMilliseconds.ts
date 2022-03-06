import { OrderDoc } from "../models/order";
import { getValidScans } from "./getValidScans";

export const getAbsoluteTimeInMilliseconds = (order: OrderDoc) => {
  const { scans } = order;

  const validScans = getValidScans(scans);

  const firstValidScan =
    validScans.length >= 1
      ? new Date(validScans[validScans.length - 1].timeStamp).getTime()
      : 0;

  const lastValidScan =
    validScans.length >= 1 ? new Date(validScans[0].timeStamp).getTime() : 0;

  return lastValidScan - firstValidScan;
};
