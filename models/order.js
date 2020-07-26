const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt-nodejs");

// Define order model

const orderSchema = new Schema({
  orderNumber: { type: String, required: true, unique: true, index: true },
  quantity: { type: Number, required: true },
  partNumber: { type: String, required: true, index: true },
  tactTime: { type: Date, required: true },
  customer: { type: String },
  status: { type: String, required: true, default: "todo", index: true },
  orderAddedAt: { type: Date, default: Date.now },
});

// Onsave hook, encrypt password
userSchema.pre("save", function (next) {
  const order = this;
  bcrypt.genSalt(10, function (err, salt) {
    if (err) {
      return next(err);
    }
    bcrypt.hash(order.password, salt, null, function (err, hash) {
      if (err) {
        return next(err);
      }
      order.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function (candidatePassword, callback) {
  const order = this;
  bcrypt.compare(candidatePassword, order.password, function (err, isMatch) {
    if (err) {
      return callback(err);
    }
    callback(null, isMatch);
  });
};

// Create the model class
const Order = mongoose.model("Order", userSchema);

// Export the model
module.exports = User;
