import { LineDoc } from "../models/line";
import { ScanAttrs } from "../models/scan";
import { getUsedLines } from "./getUsedLines";
import { getLineDescription } from "./getLineDescription";

export const getUsedLinesDescriptions = (
  scans: ScanAttrs[],
  lines: LineDoc[]
) => {
  const uniqueUsedLines = getUsedLines(scans);

  return uniqueUsedLines
    .map((_id) => {
      if (!_id) {
        return "";
      }

      return getLineDescription(_id, lines);
    })
    .join(", ");
};
