const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const redirectionSchema = new Schema({
  description: { type: String, required: true },
  redirRoute: {
    type: String,
    required: true,
    unique: true,
    index: true,
    lowercase: true,
  },
  targetUrl: { type: String, required: true },
});

const Redirection = mongoose.model("Redirection", redirectionSchema);

module.exports = Redirection;
