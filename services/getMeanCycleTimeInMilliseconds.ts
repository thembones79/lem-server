import { OrderDoc } from "../models/order";
import { millisToHhMmSs } from "./millisToHhMmSs";
import { getNetDurationInMilliseconds } from "./getNetDurationInMilliseconds";
import { getDividersSum } from "./getDividersSum";

export const getMeanCycleTimeInMilliseconds = (order: OrderDoc) => {
  const dividerForAllLines = getDividersSum(order);

  const netDurationInMilliseconds = getNetDurationInMilliseconds(order);

  const meanCycleTimeInMilliseconds =
    dividerForAllLines > 0 && netDurationInMilliseconds > 0
      ? Math.floor(netDurationInMilliseconds / dividerForAllLines)
      : 0;

  return meanCycleTimeInMilliseconds;
};
