import { OrderDoc } from "../models/order";
import { getValidScans } from "./getValidScans";
import { getUsedLines } from "./getUsedLines";
import { getGrossTimeFromOneLine } from "./getGrossTimeFromOneLine";
import { getScansFromLine } from "./getScansFromLine";

export const getGrossDurationInMilliseconds = (order: OrderDoc) => {
  const { scans } = order;

  const validScans = getValidScans(scans);
  const usedLines = getUsedLines(scans);

  let sum = 0;

  for (let i = 0; i < usedLines.length; i++) {
    const scansFromLine = getScansFromLine(validScans, usedLines[i]);
    const grossTimeInMillis = getGrossTimeFromOneLine(scansFromLine);

    sum = sum + grossTimeInMillis;
  }

  return sum;
};
