import { OrderDoc } from "../models/order";
import { millisToHhMmSs } from "./millisToHhMmSs";
import { getNetDurationInMilliseconds } from "./getNetDurationInMilliseconds";

export const getNetTime = (order: OrderDoc) => {
  const netDurationInMilliseconds = getNetDurationInMilliseconds(order);

  return netDurationInMilliseconds > 0
    ? millisToHhMmSs(netDurationInMilliseconds)
    : "not started";
};
