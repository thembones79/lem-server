import mongoose, { Schema } from "mongoose";


export interface OrderStatisticsAttrs {
  _orderId: { type: Schema.Types.ObjectId; ref: "Order" };
  lastValidScan: string;
  scansAlready: number;
  validScans: number;
  linesUsed: string;
  netTime: string;
  meanCycleTime: string;
  meanHourlyRate: number;
  meanGrossHourlyRate: number;
  standardHourlyRate: number;
  orderNumber?: string;
  quantity: number;
  partNumber?: string;
  orderStatus?: string;
  orderAddedAt: Date;
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
  meanCycleTime: string;
  meanHourlyRate: number;
  meanGrossHourlyRate: number;
  standardHourlyRate: number;
  orderNumber?: string;
  quantity: number;
  partNumber?: string;
  orderStatus?: string;
  orderAddedAt: Date;
}

export const orderStatisticsSchema = new mongoose.Schema({










  lastValidScan: string;
  scansAlready: number;
  validScans: number;
  linesUsed: string;
  netTime: string;
  meanCycleTime: string;
  meanHourlyRate: number;
  meanGrossHourlyRate: number;
  standardHourlyRate: number;
  orderNumber: { type: String, required: true, unique: true, index: true },
  quantity: { type: Number, required: true },
  partNumber: { type: String, required: true, index: true },
  orderStatus: { type: String, required: true, default: "open", index: true },
  orderAddedAt: { type: Date, default: Date.now },
  _orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },



});

export const OrderStatistics = mongoose.model<
  OrderStatisticsDoc,
  OrderStatisticsModel
>("OrderStatistics", orderStatisticsSchema);
