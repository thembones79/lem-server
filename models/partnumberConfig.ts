import mongoose from "mongoose";

export interface PartnumberConfigAttrs {
  sourceOfthuth: string;
  computationsBase: string;
}

interface PartnumberConfigModel extends mongoose.Model<PartnumberConfigDoc> {
  build(attrs: PartnumberConfigAttrs): PartnumberConfigDoc;
}

interface PartnumberConfigDoc extends mongoose.Document {
  _id: mongoose.Schema.Types.ObjectId;
  sourceOfthuth: string;
  computationsBase: string;
}

export const partnumberConfigSchema = new mongoose.Schema({
  sourceOfthuth: {
    type: String,
    required: true,
    default: "internal",
  },
  computationsBase: {
    type: String,
    required: true,
    default: "tact time",
  },
});

export const PartnumberConfig = mongoose.model<
  PartnumberConfigDoc,
  PartnumberConfigModel
>("PartnumberConfig", partnumberConfigSchema);
