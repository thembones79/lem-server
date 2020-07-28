const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const scanSchema = new Schema({
  scanContent: { type: String, required: true, unique: true, index: true },
  timeStamp: { type: Date, default: Date.now },
  errorCode: {
    type: String,
    required: true,
    unique: true,
    index: true,
    default: "e000",
  },
  _line: { type: Schema.Types.ObjectId, ref: "Line" },
  _user: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = scanSchema;
