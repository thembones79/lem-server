import { Schema } from "mongoose";
import { OrderDoc } from "../models/order";
import { getValidScans } from "./getValidScans";
import { getUsedLines } from "./getUsedLines";
import { getGrossTimeFromOneLine } from "./getGrossTimeFromOneLine";
import { getScansFromLine } from "./getScansFromLine";
import { BreakAttrs } from "../models/break";

export const getNetDurationInMillisecondsV2 = (order: OrderDoc) => {
  const { scans } = order;
  const { breaks } = order;
  const validScans = getValidScans(scans);
  const usedLines = getUsedLines(scans) as Schema.Types.ObjectId[];

  let sum = 0;

  for (let i = 0; i < usedLines.length; i++) {
    const scansFromLine = getScansFromLine(validScans, usedLines[i]);
    const grossTimeInMillis = getGrossTimeFromOneLine(scansFromLine);

    const breaksOnCurrentLine = breaks.filter(
      (item) => item._line.toString() === usedLines[i].toString()
    );

    const finishedBreaks =
      (breaksOnCurrentLine &&
        breaksOnCurrentLine.filter((item) => item.breakEnd)) ||
      [];

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

    const individualBreakTimes = finishedBreaksWithinValidScans.map(
      (item) =>
        new Date(item.breakEnd!).getTime() - new Date(item.breakStart).getTime()
    );

    const arrSum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
    const breakInMillis = arrSum(individualBreakTimes);
    const netTimeInMillis = grossTimeInMillis - breakInMillis;

    sum = sum + netTimeInMillis;
  }

  return sum;
};
