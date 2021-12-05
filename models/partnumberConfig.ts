import mongoose from "mongoose";

enum SourceOfTruth {
  internal = "internal",
  excel = "excel",
}

enum ComputationsBase {
  tactTime = "tactTime",
  hourlyRate = "hourlyRate",
}
export interface PartnumberConfigAttrs {
  sourceOftruth: SourceOfTruth;
  computationsBase: ComputationsBase;
  whatToShow: ComputationsBase;
}

interface PartnumberConfigModel extends mongoose.Model<PartnumberConfigDoc> {
  build(attrs: PartnumberConfigAttrs): PartnumberConfigDoc;
}

interface PartnumberConfigDoc extends mongoose.Document {
  _id: mongoose.Schema.Types.ObjectId;
  sourceOftruth: SourceOfTruth;
  computationsBase: ComputationsBase;
  whatToShow: ComputationsBase;
}

export const partnumberConfigSchema = new mongoose.Schema({
  sourceOftruth: {
    type: String,
    required: true,
    default: SourceOfTruth.internal,
  },
  computationsBase: {
    type: String,
    required: true,
    default: ComputationsBase.tactTime,
  },
  whatToShow: {
    type: String,
    required: true,
    default: ComputationsBase.tactTime,
  },
});

export const PartnumberConfig = mongoose.model<
  PartnumberConfigDoc,
  PartnumberConfigModel
>("PartnumberConfig", partnumberConfigSchema);
