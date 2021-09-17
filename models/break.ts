import mongoose from "mongoose";
const Schema = mongoose.Schema;

export interface BreakAttrs {
  _id?: mongoose.Schema.Types.ObjectId;
  _line: mongoose.Schema.Types.ObjectId;
  breakStart: Date;
  breakEnd?: Date | string | number;
}

interface BreakModel extends mongoose.Model<BreakDoc> {
  build(attrs: BreakAttrs): BreakDoc;
}

interface BreakDoc extends mongoose.Document {
  _id: mongoose.Schema.Types.ObjectId;
  _line?: mongoose.Schema.Types.ObjectId;
  breakStart: Date;
  breakEnd?: Date;
}

export const breakSchema = new Schema({
  breakStart: { type: Date, default: Date.now },
  breakEnd: { type: Date },
  _line: { type: Schema.Types.ObjectId, ref: "Line" },
});

export const Break = mongoose.model<BreakDoc, BreakModel>("Break", breakSchema);
