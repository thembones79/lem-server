import mongoose from "mongoose";

export interface RedirectionAttrs {
  _id?: string;
  description?: string;
  redirRoute?: string;
  targetUrl: string;
  fileName?: string;
}

interface RedirectionModel extends mongoose.Model<RedirectionDoc> {
  build(attrs: RedirectionAttrs): RedirectionDoc;
}

interface RedirectionDoc extends mongoose.Document {
  _id: string;
  description?: string;
  redirRoute?: string;
  targetUrl: string;
  fileName?: string;
}

export const redirectionSchema = new mongoose.Schema({
  description: { type: String, required: true },
  redirRoute: {
    type: String,
    required: true,
    unique: true,
    index: true,
    lowercase: true,
  },
  targetUrl: { type: String, required: true },
  fileName: { type: String },
});

export const Redirection = mongoose.model<RedirectionDoc, RedirectionModel>(
  "Redirection",
  redirectionSchema
);
