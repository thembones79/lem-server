import { ScanAttrs } from "../models/scan";

export const getGrossTimeFromOneLine = (scans: ScanAttrs[]) => {
  if (scans.length > 0) {
    const newestScan = new Date(scans[0].timeStamp).getTime();
    const oldestScan = new Date(scans[scans.length - 1].timeStamp).getTime();
    return newestScan - oldestScan;
  }

  return 0;
};
