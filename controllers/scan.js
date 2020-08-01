const Order = require("../models/order");
const scanSchema = require("../models/scan");
const Scan = mongoose.model("Scan", scanSchema);

exports.addScan = function (req, res, next) {
  const orderNumber = req.body.orderNumber;
  const scanContent = req.body.scanContent;
  const errorCode = req.body.errorCode || "e000";
  const _line = req.body._line;
  const _user = req.body._user;

  if (!orderNumber || !scanContent || !errorCode || !_line || !_user) {
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

    const scan = new Scan({
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
