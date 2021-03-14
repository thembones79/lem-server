import mongoose from "mongoose";

export interface ProductAttrs {
  _id?: mongoose.Schema.Types.ObjectId;
  partNumber?: string;
  linksToDocs: {
    description?: string;
    url?: string;
    fileName?: string;
  }[];
  tactTime?: number;
  linksToRedirs: mongoose.Schema.Types.ObjectId[];
}

interface ProductModel extends mongoose.Model<ProductDoc> {
  build(attrs: ProductAttrs): ProductDoc;
}

interface ProductDoc extends mongoose.Document {
  _id: mongoose.Schema.Types.ObjectId;
  partNumber?: string;
  linksToDocs: {
    description?: string;
    url?: string;
    fileName?: string;
  }[];
  tactTime?: number;
  linksToRedirs: mongoose.Schema.Types.ObjectId[];
}

export const productSchema = new mongoose.Schema({
  partNumber: { type: String, required: true, index: true, unique: true },
  linksToDocs: [
    {
      description: { type: String, required: true },
      url: { type: String, required: true },
      fileName: { type: String },
    },
  ],
  tactTime: { type: Number, default: 0 },
  linksToRedirs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Redirection" }],
});

productSchema.post("save", function (doc, next) {
  doc
    .populate("linksToRedirs")
    .execPopulate()
    .then(function () {
      next();
    });
});

export const Product = mongoose.model<ProductDoc, ProductModel>(
  "Product",
  productSchema
);
