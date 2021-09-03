import { OrderDoc } from "../models/order";
import { getGrossDurationInMilliseconds } from "./getGrossDurationInMilliseconds";
import { getBreakTimesInMilliseconds } from "./getBreakTimesInMilliseconds";

export const getNetDurationInMilliseconds = (order: OrderDoc) => {
  return (
    getGrossDurationInMilliseconds(order) - getBreakTimesInMilliseconds(order)
  );
};
