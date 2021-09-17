import { ScanAttrs } from "../models/scan";
import { removeDuplicates } from "./removeDuplicates";

export const getUsedLines = (scans: ScanAttrs[]) => {
  const usedLines = scans.map((scan) => scan._line) as [];

  return removeDuplicates(usedLines);
};
