import { OrderDoc } from "../models/order";
import { millisToHhMmSs } from "./millisToHhMmSs";
import { getGrossDurationInMilliseconds } from "./getGrossDurationInMilliseconds";

export const getGrossTime = (order: OrderDoc) => {
  const grossDurationInMilliseconds = getGrossDurationInMilliseconds(order);

  return grossDurationInMilliseconds > 0
    ? millisToHhMmSs(grossDurationInMilliseconds)
    : "not started";
};
