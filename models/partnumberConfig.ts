import mongoose from "mongoose";

enum SourceOfTruth {
  internal = "internal",
  excel = "excel",
}

enum ComputationsBase {
  tactTime = "tactTime",
  hourlyPace = "hourlyPace",
}
export interface PartnumberConfigAttrs {
  sourceOftruth: SourceOfTruth;
  computationsBase: ComputationsBase;
}

interface PartnumberConfigModel extends mongoose.Model<PartnumberConfigDoc> {
  build(attrs: PartnumberConfigAttrs): PartnumberConfigDoc;
}

interface PartnumberConfigDoc extends mongoose.Document {
  _id: mongoose.Schema.Types.ObjectId;
  sourceOftruth: SourceOfTruth;
  computationsBase: ComputationsBase;
}

export const partnumberConfigSchema = new mongoose.Schema({
  sourceOftruth: {
    type: String,
    enum: SourceOfTruth,
    required: true,
    default: SourceOfTruth.internal,
  },
  computationsBase: {
    type: String,
    enum: ComputationsBase,
    required: true,
    default: ComputationsBase.tactTime,
  },
});

export const PartnumberConfig = mongoose.model<
  PartnumberConfigDoc,
  PartnumberConfigModel
>("PartnumberConfig", partnumberConfigSchema);
