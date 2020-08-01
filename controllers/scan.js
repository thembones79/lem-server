

scanContent: {
  type: String,
  required: true,
  index: true,
  sparse: true,
},
timeStamp: { type: Date, default: Date.now },
errorCode: {
  type: String,
  required: true,
  index: true,
  default: "e000",
},
_line: { type: Schema.Types.ObjectId, ref: "Line" },
_user: { type: Schema.Types.ObjectId, ref: "User" },
});




const Order = require("../models/order");
const scanSchema = require("../models/scan");

const Scan = mongoose.model("Scan", scanSchema);

exports.addScan = function (req, res, next) {
  const orderNumber = req.body.orderNumber;
  const quantity = req.body.quantity;
  const partNumber = req.body.partNumber;
  const qrCode = req.body.qrCode;
  const tactTime = req.body.tactTime;
  const customer = req.body.customer;
  const orderStatus = "todo";
  const breaks = [];
  const scans = [];

  if (
    !orderNumber ||
    !quantity ||
    !partNumber ||
    !qrCode ||
    !tactTime ||
    !customer
  ) {
    return res.status(422).send({
      error: "Not enough values!",
    });
  }
  Order.findOne({ orderNumber: orderNumber }, function (err, existingOrder) {
    if (err) {
      return next(err);
    }

    if (existingOrder) {
      return res.status(422).send({ error: "Order exists" });
    }

    const order = new Order({
      orderNumber,
      quantity,
      partNumber,
      qrCode,
      customer,
      tactTime,
      orderStatus,
      breaks,
      scans,
    });

    order.save(function (err) {
      if (err) {
        return next(err);
      }
      res.json({
        order,
      });
    });
  });
};
