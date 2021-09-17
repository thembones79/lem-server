import { Schema } from "mongoose";

import { ScanAttrs } from "../models/scan";

export const getScansFromLine = (
  scans: ScanAttrs[],
  lineId: Schema.Types.ObjectId
) => {
  return (
    (scans &&
      scans.filter((scan) => scan._line?.toString() === lineId.toString())) ||
    []
  );
};
