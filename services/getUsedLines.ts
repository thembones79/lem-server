import { ScanAttrs } from "../models/scan";
import { removeDuplicates } from "./removeDuplicates";
import { getValidScans } from "./getValidScans";

export const getUsedLines = (scans: ScanAttrs[]) => {
  const scansWithoutErrors = getValidScans(scans);
  const usedLines = scansWithoutErrors.map((scan) => scan._line) as [];
  return removeDuplicates(usedLines);
};
