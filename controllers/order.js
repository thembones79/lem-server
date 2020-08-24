const Order = require("../models/order");

exports.addOrder = function (req, res, next) {
  const orderNumber = req.body.orderNumber;
  const quantity = req.body.quantity;
  const partNumber = req.body.partNumber;
  const qrCode = req.body.qrCode;
  const tactTime = req.body.tactTime || 36000;
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

exports.getOrders = function (req, res, next) {
  Order.find({}, function (err, orders) {
    if (err) {
      return next(err);
    }

    res.json({
      orders,
    });
  });
};

exports.closeOrder = function (req, res, next) {
  try {
    const orderNumber = req.body.orderNumber;

    if (!orderNumber) {
      return res.status(422).send({
        error: "You must provide order number!",
      });
    }

    Order.findOne({ orderNumber }, function (err, existingOrder) {
      if (err) {
        return next(err);
      }

      if (!existingOrder) {
        return res.status(422).send({ error: "Order does not exist!" });
      }

      if (existingOrder.orderStatus === "closed") {
        return res.status(422).send({ error: "Order is already closed!" });
      }

      // logic closed in in IF STATEMENT beause there can be other statuses in the future
      if (existingOrder.orderStatus === "open") {
        existingOrder.orderStatus = "closed";
        existingOrder.save(function (err) {
          if (err) {
            return next(err);
          }
          const message = `Updated order no. ${existingOrder.orderNumber} status to: ${existingOrder.orderStatus}`;

          res.json({
            message,
          });
        });
      } else {
        const message = `No changes were added`;

        res.json({
          message,
        });
      }
    });
  } catch (error) {
    return next(error);
  }
};

exports.deleteOrder = function (req, res, next) {
  try {
    const orderNumber = req.params.dashedordernumber.replace(/-/g, "/");

    if (!orderNumber) {
      return res.status(422).send({
        error: "You must provide order number!",
      });
    }

    Order.findOneAndRemove({ orderNumber }, function (err, existingOrder) {
      if (err) {
        return next(err);
      } else if (!existingOrder) {
        return res.status(422).send({ error: "Order does not exist!" });
      } else {
        const message = `Deleted order no. ${existingOrder.orderNumber}`;

        res.json({
          message,
        });
      }
    });
  } catch (error) {
    return next(error);
  }
};
