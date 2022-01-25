import { Schema } from "mongoose";
import { OrderDoc } from "../models/order";
import { BreakAttrs } from "../models/break";
import { getValidScans } from "./getValidScans";
import { getUsedLines } from "./getUsedLines";

export const getBreakTimesInMilliseconds = (order: OrderDoc) => {
  const { breaks } = order;
  const { scans } = order;

  const usedLines = getUsedLines(scans) as Schema.Types.ObjectId[];

  let brakesOnUsedLines = [] as BreakAttrs[];

  console.log({ boul1: brakesOnUsedLines });

  for (let i = 0; i < usedLines.length; i++) {
    brakesOnUsedLines = [
      ...brakesOnUsedLines,

      ...breaks.filter(
        (item) => item._line.toString() === usedLines[i].toString()
      ),
    ];
  }
  console.log({ boul2: brakesOnUsedLines });

  const finishedBreaks =
    (brakesOnUsedLines && brakesOnUsedLines.filter((item) => item.breakEnd)) ||
    [];
  console.log({ finishedBreaks });
  const validScans = getValidScans(scans);

  const firstValidScan =
    validScans.length >= 1
      ? new Date(validScans[validScans.length - 1].timeStamp).getTime()
      : 0;

  const lastValidScan =
    validScans.length >= 1 ? new Date(validScans[0].timeStamp).getTime() : 0;

  console.log({ firstValidScan });

  const finishedBreaksWithinValidScans =
    (finishedBreaks &&
      finishedBreaks.filter(
        (item) =>
          new Date(item.breakStart).getTime() > firstValidScan &&
          // @ts-ignore
          new Date(item.breakEnd).getTime() < lastValidScan
      )) ||
    [];

  console.log({ finishedBreaksWithinValidScans });

  const individualBreakTimes = finishedBreaksWithinValidScans.map(
    (item) =>
      new Date(item.breakEnd!).getTime() - new Date(item.breakStart).getTime()
  );

  console.log({ individualBreakTimes });

  const arrSum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

  console.log({ sum: arrSum(individualBreakTimes) });

  return arrSum(individualBreakTimes);
};
