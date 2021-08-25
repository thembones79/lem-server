import mongoose from "mongoose";

export interface LineAttrs {
  _id?: mongoose.Schema.Types.ObjectId;
  lineNumber?: number;
  lineDescription?: string;
  lineOccupiedWith?: string;
  lineStatus?: string;
}

interface LineModel extends mongoose.Model<LineDoc> {
  build(attrs: LineAttrs): LineDoc;
}

export interface LineDoc extends mongoose.Document {
  _id: mongoose.Schema.Types.ObjectId;
  lineNumber?: number;
  lineDescription?: string;
  lineOccupiedWith?: string;
  lineStatus?: string;
}

export const lineSchema = new mongoose.Schema({
  lineNumber: { type: Number, required: true, unique: true, index: true },
  lineDescription: { type: String, default: "" },
  lineOccupiedWith: { type: String, default: "" },
  lineStatus: {
    type: String,
    required: true,
    index: true,
    default: "free",
  },
});

export const Line = mongoose.model<LineDoc, LineModel>("Line", lineSchema);
