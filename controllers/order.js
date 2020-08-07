const Order = require("../models/order");

exports.addOrder = function (req, res, next) {
  const orderNumber = req.body.orderNumber;
  const quantity = req.body.quantity;
  const partNumber = req.body.partNumber;
  const qrCode = req.body.qrCode;
  const tactTime = req.body.tactTime;
  const customer = req.body.customer;
  const orderStatus = "open";
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

exports.getOrder = function (req, res, next) {
  const orderNumber = req.params.dashedordernumber.replace(/-/g, "/");
  console.log({ orderNumber });
  if (!orderNumber) {
    return res.status(422).send({
      error: "You have to provide order number!",
    });
  }
  Order.findOne({ orderNumber: orderNumber }, function (err, existingOrder) {
    if (err) {
      return next(err);
    }

    res.json({
      existingOrder,
    });
  });
};
