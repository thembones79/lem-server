import { OrderDoc } from "../models/order";
import { millisToHhMmSs } from "./millisToHhMmSs";
import { getMeanCycleTimeInMilliseconds } from "./getMeanCycleTimeInMilliseconds";

export const getMeanCycleTime = (order: OrderDoc) => {
  const meanCycleTimeInMilliseconds = getMeanCycleTimeInMilliseconds(order);

  return millisToHhMmSs(meanCycleTimeInMilliseconds);
};
