import { ScanAttrs } from "../models/scan";

export const getValidScans = (scans: ScanAttrs[]) => {
  return (
    (scans &&
      scans.filter(
        (scan) => scan.errorCode === "e000" || scan.errorCode === "e004"
      )) ||
    []
  );
};
