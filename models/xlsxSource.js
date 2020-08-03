const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const xlsxSourceSchema = new Schema({
  menuContent: [
    {
      orderNumber: String,
      quantity: Number,
      customer: String,
      qrCode: String,
      partNumber: String,
      tactTime: Number,
    },
  ],
  timeStamp: { type: Date, default: Date.now },
  idCode: {
    type: String,
    required: true,
    index: true,
    default: "menu",
  },
});

module.exports = scanSchema;

// Create the model class
const XlsxSource = mongoose.model("XlsxSource", xlsxSourceSchema);

// Export the model
module.exports = XlsxSource;
