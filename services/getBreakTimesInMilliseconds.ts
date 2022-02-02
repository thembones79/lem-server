import { Schema } from "mongoose";
import { OrderDoc } from "../models/order";
import { BreakAttrs } from "../models/break";
import { getValidScans } from "./getValidScans";
import { getUsedLines } from "./getUsedLines";

import { getScansFromLine } from "./getScansFromLine";

export const getBreakTimesInMilliseconds = (order: OrderDoc) => {
  const { breaks } = order;
  const { scans } = order;

  const validScans = getValidScans(scans);
  const usedLines = getUsedLines(scans) as Schema.Types.ObjectId[];

  let breaksInMillis = [] as number[];

  console.log({ B1: breaksInMillis });

  for (let i = 0; i < usedLines.length; i++) {
    const scansFromLine = getScansFromLine(validScans, usedLines[i]);
    const brakesOnCurrentLine = breaks.filter(
      (item) => item._line.toString() === usedLines[i].toString()
    );

    console.log({ brakesOnCurrentLine });

    const finishedBreaks =
      (brakesOnCurrentLine &&
        brakesOnCurrentLine.filter((item) => item.breakEnd)) ||
      [];
    console.log({ finishedBreaks });

    const firstValidScan =
      scansFromLine.length >= 1
        ? new Date(scansFromLine[scansFromLine.length - 1].timeStamp).getTime()
        : 0;

    const lastValidScan =
      scansFromLine.length >= 1
        ? new Date(scansFromLine[0].timeStamp).getTime()
        : 0;

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

    breaksInMillis = [...breaksInMillis, ...individualBreakTimes];
  }

  const arrSum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
  console.log({ B2: breaksInMillis });
  return arrSum(breaksInMillis);
};
