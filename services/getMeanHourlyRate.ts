import { OrderDoc } from "../models/order";
import { getValidScans } from "./getValidScans";
import { getNetDurationInMilliseconds } from "./getNetDurationInMilliseconds";

export const getMeanHourlyRate = (order: OrderDoc) => {
  const { scans } = order;

  const validScans = getValidScans(scans);

  const netDurationInMilliseconds = getNetDurationInMilliseconds(order);

  const netDurationInHours = netDurationInMilliseconds / (1000 * 60 * 60);

  return validScans.length / netDurationInHours;
};
