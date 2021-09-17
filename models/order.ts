import mongoose from "mongoose";
import { breakSchema, BreakAttrs } from "./break";
import { scanSchema, ScanAttrs } from "./scan";

export interface OrderAttrs {
  orderNumber?: string;
  quantity: number;
  partNumber?: string;
  qrCode: string;
  tactTime?: number;
  customer?: string;
  orderStatus?: string;
  orderAddedAt: Date;
  breaks: BreakAttrs[];
  scans: ScanAttrs[];
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

export interface OrderDoc extends mongoose.Document {
  orderNumber?: string;
  quantity: number;
  partNumber?: string;
  qrCode: string;
  tactTime?: number;
  customer?: string;
  orderStatus?: string;
  orderAddedAt: Date;
  breaks: BreakAttrs[];
  scans: ScanAttrs[];
}

export const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true, index: true },
  quantity: { type: Number, required: true },
  partNumber: { type: String, required: true, index: true },
  qrCode: { type: String, required: true },
  tactTime: { type: Number },
  customer: { type: String },
  orderStatus: { type: String, required: true, default: "open", index: true },
  orderAddedAt: { type: Date, default: Date.now },
  breaks: [breakSchema],
  scans: [scanSchema],
});

export const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);
