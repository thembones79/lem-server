const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  partNumber: { type: String, required: true, index: true, unique: true },
  linksToDocs: [
    {
      description: { type: String, required: true },
      url: { type: String, required: true },
    },
  ],
  tactTime: { type: Number },
  linksToRedirs: [
    {
      _redirection: { type: Schema.Types.ObjectId, ref: "Redirection" },
    },
  ],
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
