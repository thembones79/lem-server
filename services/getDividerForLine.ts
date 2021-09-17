import { Schema } from "mongoose";
import { getValidScans } from "./getValidScans";
import { ScanAttrs } from "../models/scan";
import { getScansFromLine } from "./getScansFromLine";

export const getDividerForLine = (
  scans: ScanAttrs[],
  lineId: Schema.Types.ObjectId
) => {
  const validScans = getValidScans(scans);

  const scansFromLine = getScansFromLine(validScans, lineId).length;

  if (scansFromLine < 2) {
    return 1;
  }

  return scansFromLine - 1;
};
