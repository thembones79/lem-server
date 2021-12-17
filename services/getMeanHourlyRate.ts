import { OrderDoc } from "../models/order";
import { getNetDurationInMilliseconds } from "./getNetDurationInMilliseconds";
import { getDividersSum } from "./getDividersSum";

export const getMeanHourlyRate = (order: OrderDoc) => {
  const dividerForAllLines = getDividersSum(order);

  const netDurationInMilliseconds = getNetDurationInMilliseconds(order);

  const netDurationInHours = netDurationInMilliseconds / (1000 * 60 * 60);

  return dividerForAllLines / netDurationInHours || 0;
};
