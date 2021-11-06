import mongoose, { Schema } from "mongoose";

export interface ProductStatisticsAttrs {
  setHourlyRate: number;
  suggestedHourlyRate: number;
  automatic: boolean;
  partNumber: string;
}

interface ProductStatisticsModel extends mongoose.Model<ProductStatisticsDoc> {
  build(attrs: ProductStatisticsAttrs): ProductStatisticsDoc;
}

export interface ProductStatisticsDoc extends mongoose.Document {
  setHourlyRate: number;
  suggestedHourlyRate: number;
  automatic: boolean;
  partNumber: string;
}

export const ProductStatisticsSchema = new mongoose.Schema({
  setHourlyRate: { type: Number, default: 1 },
  suggestedHourlyRate: { type: Number, default: 1 },
  automatic: { type: Boolean, default: true },
  partNumber: { type: String, required: true, index: true },
});

export const ProductStatistics = mongoose.model<
  ProductStatisticsDoc,
  ProductStatisticsModel
>("ProductStatistics", ProductStatisticsSchema);
