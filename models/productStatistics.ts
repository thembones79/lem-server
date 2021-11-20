import mongoose, { Schema } from "mongoose";

export interface ProductStatisticsAttrs {
  givenHourlyRate: number;
  shownComputedTactTime: number;
  suggestedHourlyRate: number;
  givenTactTime: number;
  shownComputedHourlyRate: number;
  suggestedTactTime: number;
  automatic: boolean;
  partNumber: string;
}

interface ProductStatisticsModel extends mongoose.Model<ProductStatisticsDoc> {
  build(attrs: ProductStatisticsAttrs): ProductStatisticsDoc;
}

export interface ProductStatisticsDoc extends mongoose.Document {
  givenHourlyRate: number;
  shownComputedTactTime: number;
  suggestedHourlyRate: number;
  givenTactTime: number;
  shownComputedHourlyRate: number;
  suggestedTactTime: number;
  automatic: boolean;
  partNumber: string;
}

export const ProductStatisticsSchema = new mongoose.Schema({
  givenHourlyRate: { type: Number, default: 1 },
  shownComputedTactTime: { type: Number, default: 3600 },
  suggestedHourlyRate: { type: Number, default: 1 },
  givenTactTime: { type: Number, default: 3600 },
  shownComputedHourlyRate: { type: Number, default: 1 },
  suggestedTactTime: { type: Number, default: 3600 },
  automatic: { type: Boolean, default: true },
  partNumber: { type: String, required: true, index: true },
});

export const ProductStatistics = mongoose.model<
  ProductStatisticsDoc,
  ProductStatisticsModel
>("ProductStatistics", ProductStatisticsSchema);
