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

  for (let i = 0; i < usedLines.length; i++) {
    brakesOnUsedLines = [
      ...brakesOnUsedLines,

      ...breaks.filter(
        (item) => item._line.toString() === usedLines[i].toString()
      ),
    ];
  }

  const finishedBreaks =
    (brakesOnUsedLines && brakesOnUsedLines.filter((item) => item.breakEnd)) ||
    [];

  const validScans = getValidScans(scans);

  const firstValidScan = new Date(
    validScans[validScans.length - 1].timeStamp
  ).getTime();

  const finishedBreaksWithinValidScans =
    (finishedBreaks &&
      finishedBreaks.filter(
        (item) => new Date(item.breakStart).getTime() > firstValidScan
      )) ||
    [];

  const individualBreakTimes = finishedBreaksWithinValidScans.map(
    (item) =>
      new Date(item.breakEnd!).getTime() - new Date(item.breakStart).getTime()
  );

  const arrSum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

  return arrSum(individualBreakTimes);
};
