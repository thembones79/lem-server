import { OrderDoc } from "../models/order";
import { getValidScans } from "./getValidScans";

export const getGrossDurationInMilliseconds = (order: OrderDoc) => {
  const { scans, orderAddedAt } = order;

  const validScans = getValidScans(scans);

  const newestScan =
    validScans.length > 0 ? new Date(validScans[0].timeStamp).getTime() : 0;

  const orderStart = new Date(orderAddedAt).getTime();

  return newestScan - orderStart;
};
