import mongoose from "mongoose";

export interface PartnumberConfigAttrs {
  menusourceOfthuth: string;
}

interface PartnumberConfigModel extends mongoose.Model<PartnumberConfigDoc> {
  build(attrs: PartnumberConfigAttrs): PartnumberConfigDoc;
}

interface PartnumberConfigDoc extends mongoose.Document {
  _id: mongoose.Schema.Types.ObjectId;
  menusourceOfthuth: string;
}

export const partnumberConfigSchema = new mongoose.Schema({
  sourceOfthuth: {
    type: String,
    required: true,
    default: "tact time",
  },
});

export const PartnumberConfig = mongoose.model<
  PartnumberConfigDoc,
  PartnumberConfigModel
>("PartnumberConfig", partnumberConfigSchema);
