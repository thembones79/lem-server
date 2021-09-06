import { OrderDoc } from "../models/order";

export const getBreakTimesInMilliseconds = (order: OrderDoc) => {
  const { breaks } = order;

  const finishedBreaks =
    (breaks && breaks.filter((item) => item.breakEnd)) || [];

  const individualBreakTimes = finishedBreaks.map(
    (item) =>
      new Date(item.breakEnd!).getTime() - new Date(item.breakStart).getTime()
  );

  const arrSum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

  return arrSum(individualBreakTimes);
};
