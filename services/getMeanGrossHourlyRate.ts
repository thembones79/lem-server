import { OrderDoc } from "../models/order";
import { getDividersSum } from "./getDividersSum";
import { getGrossDurationInMilliseconds } from "./getGrossDurationInMilliseconds";

export const getMeanGrossHourlyRate = (order: OrderDoc) => {
  const dividerForAllLines = getDividersSum(order);

  const grossDurationInMilliseconds = getGrossDurationInMilliseconds(order);

  const grossDurationInHours = grossDurationInMilliseconds / (1000 * 60 * 60);

  const meanGrossHourlyRate = dividerForAllLines / grossDurationInHours;

  return meanGrossHourlyRate > 0 && meanGrossHourlyRate < 3600
    ? meanGrossHourlyRate
    : 0;
};
