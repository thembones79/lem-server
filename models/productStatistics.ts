import mongoose, { Schema } from "mongoose";

export interface ProductStatisticsAttrs {
  givenHourlyRate: number;
  suggestedHourlyRate: number;
  givenTactTime: number;
  suggestedTactTime: number;
  xlsxTactTime: number;
  cleanRoomTime: number;
  automatic: boolean;
  partNumber: string;
}

interface ProductStatisticsModel extends mongoose.Model<ProductStatisticsDoc> {
  build(attrs: ProductStatisticsAttrs): ProductStatisticsDoc;
}

export interface ProductStatisticsDoc extends mongoose.Document {
  givenHourlyRate: number;
  suggestedHourlyRate: number;
  givenTactTime: number;
  suggestedTactTime: number;
  cleanRoomTime: number;
  xlsxTactTime: number;
  automatic: boolean;
  partNumber: string;
}

export const ProductStatisticsSchema = new mongoose.Schema({
  givenHourlyRate: { type: Number, default: 1 },
  suggestedHourlyRate: { type: Number, default: 1 },
  givenTactTime: { type: Number, default: 3600 },
  suggestedTactTime: { type: Number, default: 3600 },
  xlsxTactTime: { type: Number, default: 36000 }, // 10 hours
  cleanRoomTime: { type: Number, default: 1 },
  automatic: { type: Boolean, default: false },
  partNumber: { type: String, required: true, index: true },
});

export const ProductStatistics = mongoose.model<
  ProductStatisticsDoc,
  ProductStatisticsModel
>("ProductStatistics", ProductStatisticsSchema);
