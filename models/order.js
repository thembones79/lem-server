const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const breakSchema = require("./break");
const scanSchema = require("./scan");

// Define order model

const orderSchema = new Schema({
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

// Create the model class
const Order = mongoose.model("Order", orderSchema);

// Export the model
module.exports = Order;
