import mongoose, { Schema } from "mongoose";

export interface OrderStatisticsAttrs {
  _orderId: { type: Schema.Types.ObjectId; ref: "Order" };
  lastValidScan: string;
  scansAlready: number;
  validScans: number;
  linesUsed: string;
  netTime: string;
  grossTime: string;
  absoluteTime: string;
  meanCycleTime: string;
  meanCycleTimeInMilliseconds: number;
  meanHourlyRate: number;
  meanGrossHourlyRate: number;
  givenHourlyRate: number;
  givenTactTime: number;
  xlsxTactTime: number;
  orderNumber: string;
  quantity: number;
  partNumber: string;
  orderStatus: string;
  orderAddedAt: string;
}

interface OrderStatisticsModel extends mongoose.Model<OrderStatisticsDoc> {
  build(attrs: OrderStatisticsAttrs): OrderStatisticsDoc;
}

export interface OrderStatisticsDoc extends mongoose.Document {
  _orderId: { type: Schema.Types.ObjectId; ref: "Order" };
  lastValidScan: string;
  scansAlready: number;
  validScans: number;
  linesUsed: string;
  netTime: string;
  grossTime: string;
  absoluteTime: string;
  meanCycleTime: string;
  meanCycleTimeInMilliseconds: number;
  meanHourlyRate: number;
  meanGrossHourlyRate: number;
  givenHourlyRate: number;
  givenTactTime: number;
  xlsxTactTime: number;
  orderNumber: string;
  quantity: number;
  partNumber: string;
  orderStatus: string;
  orderAddedAt: string;
}

export const orderStatisticsSchema = new mongoose.Schema({
  lastValidScan: { type: String },
  scansAlready: { type: Number },
  validScans: { type: Number },
  linesUsed: { type: String },
  netTime: { type: String },
  grossTime: { type: String },
  absoluteTime: { type: String },
  meanCycleTime: { type: String },
  meanHourlyRate: { type: Number },
  meanGrossHourlyRate: { type: Number },
  meanCycleTimeInMilliseconds: { type: Number },
  givenHourlyRate: { type: Number },
  givenTactTime: { type: Number },
  xlsxTactTime: { type: Number },
  orderNumber: { type: String, required: true, unique: true, index: true },
  quantity: { type: Number, required: true },
  partNumber: { type: String, required: true, index: true },
  orderStatus: { type: String },
  orderAddedAt: { type: String },
  _orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
});

export const OrderStatistics = mongoose.model<
  OrderStatisticsDoc,
  OrderStatisticsModel
>("OrderStatistics", orderStatisticsSchema);
