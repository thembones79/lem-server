const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define line model

const lineSchema = new Schema({
  lineNumber: { type: Number, required: true, unique: true, index: true },
  lineDescription: { type: String, default: "" },
  lineStatus: {
    type: String,
    required: true,
    unique: true,
    index: true,
    default: "free",
  },
});

// Create the model class
const Line = mongoose.model("Line", lineSchema);

// Export the model
module.exports = Line;
