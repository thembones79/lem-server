import mongoose from "mongoose";

export interface XlsxSourceAttrs {
  _id?: mongoose.Schema.Types.ObjectId;
  menuContent?: {
    orderNumber?: string;
    quantity?: number;
    customer?: string;
    qrCode?: string;
    partNumber?: string;
    tactTime?: number;
  }[];
  timeStamp?: Date;
  idCode?: string;
}

interface XlsxSourceModel extends mongoose.Model<XlsxSourceDoc> {
  build(attrs: XlsxSourceAttrs): XlsxSourceDoc;
}

interface XlsxSourceDoc extends mongoose.Document {
  _id: mongoose.Schema.Types.ObjectId;
  menuContent?: {
    orderNumber?: string;
    quantity?: number;
    customer?: string;
    qrCode?: string;
    partNumber?: string;
    tactTime?: number;
  }[];
  timeStamp?: Date;
  idCode?: string;
}

export const xlsxSourceSchema = new mongoose.Schema({
  menuContent: [
    {
      orderNumber: String,
      quantity: Number,
      customer: String,
      qrCode: String,
      partNumber: String,
      tactTime: Number,
    },
  ],
  timeStamp: { type: Date, default: Date.now },
  idCode: {
    type: String,
    required: true,
    index: true,
    default: "menu",
  },
});

export const XlsxSource = mongoose.model<XlsxSourceDoc, XlsxSourceModel>(
  "XlsxSource",
  xlsxSourceSchema
);
