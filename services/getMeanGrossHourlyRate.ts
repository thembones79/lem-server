import { OrderDoc } from "../models/order";
import { getValidScans } from "./getValidScans";
import { getGrossDurationInMilliseconds } from "./getGrossDurationInMilliseconds";

export const getMeanGrossHourlyRate = (order: OrderDoc) => {
  const { scans } = order;

  const validScans = getValidScans(scans);

  const grossDurationInMilliseconds = getGrossDurationInMilliseconds(order);

  const grossDurationInHours = grossDurationInMilliseconds / (1000 * 60 * 60);

  return validScans.length / grossDurationInHours;
};
