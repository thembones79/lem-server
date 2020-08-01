const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const breakSchema = new Schema({
  breakStart: { type: Date },
  breakEnd: { type: Date },
  _line: { type: Schema.Types.ObjectId, ref: "Line" },
});

module.exports = breakSchema;
