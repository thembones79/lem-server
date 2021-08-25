import { Schema } from "mongoose";
import { LineDoc } from "../models/line";
import { ScanAttrs } from "../models/scan";
import { removeDuplicates } from "./removeDuplicates";

export const getUsedLinesDescriptions = (
  scans: ScanAttrs[],
  lines: LineDoc[]
) => {
  const usedLines = scans.map((scan) => scan._line) as [];

  const uniqueUsedLines = removeDuplicates(usedLines);

  const getLineDescription = (_id: Schema.Types.ObjectId, lines: LineDoc[]) => {
    const foundLine = lines.filter((line) => {
      return line._id.toString() === _id.toString();
    });

    if (!foundLine.length) {
      return "";
    }
    return foundLine[0].lineDescription;
  };

  return uniqueUsedLines
    .map((_id) => {
      if (!_id) {
        return "";
      }

      return getLineDescription(_id, lines);
    })
    .join(", ");
};
