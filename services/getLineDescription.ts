import { Schema } from "mongoose";
import { LineDoc } from "../models/line";

export const getLineDescription = (
  _id: Schema.Types.ObjectId | string,
  lines: LineDoc[]
) => {
  const foundLine = lines.filter((line) => {
    return line._id.toString() === _id.toString();
  });

  if (!foundLine.length) {
    return "";
  }
  return foundLine[0].lineDescription;
};
