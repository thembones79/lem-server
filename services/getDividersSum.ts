import { OrderDoc } from "../models/order";
import { getValidScans } from "./getValidScans";
import { getUsedLines } from "./getUsedLines";
import { getDividerForLine } from "./getDividerForLine";

export const getDividersSum = (order: OrderDoc) => {
  const { scans } = order;

  const validScans = getValidScans(scans);
  const usedLines = getUsedLines(scans);

  let sum = 0;

  for (let i = 0; i < usedLines.length; i++) {
    const divider = getDividerForLine(validScans, usedLines[i]);

    sum = sum + divider;
  }

  return sum;
};
