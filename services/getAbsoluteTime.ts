import { OrderDoc } from "../models/order";
import { millisToHhMmSs } from "./millisToHhMmSs";
import { getAbsoluteTimeInMilliseconds } from "./getAbsoluteTimeInMilliseconds";

export const getAbsoluteTime = (order: OrderDoc) => {
  const absoluteTimeInMilliseconds = getAbsoluteTimeInMilliseconds(order);

  return absoluteTimeInMilliseconds > 0
    ? millisToHhMmSs(absoluteTimeInMilliseconds)
    : "not started";
};
