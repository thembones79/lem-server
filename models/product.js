const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  partNumber: { type: String, required: true, index: true, unique: true },
  linksToDocs: [
    {
      description: { type: String, required: true },
      url: { type: String, required: true },
      fileName: { type: String },
    },
  ],
  tactTime: { type: Number, default: 0 },
  linksToRedirs: [{ type: Schema.Types.ObjectId, ref: "Redirection" }],
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
