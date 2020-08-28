const mongoose = require("mongoose");
const Order = require("../models/order");
const breakSchema = require("../models/break");
const Break = mongoose.model("Break", breakSchema);

exports.addBreakStart = function (req, res, next) {
  const orderNumber = req.body.orderNumber;
  const breakStart = new Date();
  const _line = req.body._line;

  if (!orderNumber || !_line) {
    return res.status(422).send({
      error: "Not enough values!",
    });
  }
  Order.findOne({ orderNumber: orderNumber }, function (err, existingOrder) {
    if (err) {
      return next(err);
    }

    if (!existingOrder) {
      return res.status(422).send({ error: "Order does not exist" });
    }

    const { orderStatus, breaks } = existingOrder;

    if (orderStatus === "closed") {
      return res.status(422).send({ error: "Order is completed" });
    }

    // broken naming convention: "newBreak" instead of "break", because "break" is a special, reserved word
    const newBreak = new Break({
      breakStart,
      _line,
    });

    breaks.push(newBreak);

    existingOrder.save(function (err) {
      if (err) {
        return next(err);
      }
      res.json({
        existingOrder,
      });
    });
  });
};

exports.addBreakEnd = function (req, res, next) {
  try {
    const orderNumber = req.body.orderNumber;
    const breakEnd = new Date();
    const _line = req.body._line;

    if (!orderNumber || !_line) {
      return res.status(422).send({
        error: "Not enough values!",
      });
    }
    Order.findOne({ orderNumber: orderNumber }, function (err, existingOrder) {
      if (err) {
        return next(err);
      }

      if (!existingOrder) {
        return res.status(422).send({ error: "Order does not exist" });
      }

      const { orderStatus, breaks } = existingOrder;

      if (orderStatus === "closed") {
        return res.status(422).send({ error: "Order is completed" });
      }

      const thisLineBreaks = breaks.filter((item) => item._line == _line);

      if (thisLineBreaks.length === 0) {
        return res.status(422).send({ error: "Break does not exist" });
      } else {
        const breakId = thisLineBreaks[thisLineBreaks.length - 1]._id;

        const breaksIndex = breaks.findIndex((item) => item._id === breakId);

        breaks[breaksIndex].breakEnd = breakEnd;

        existingOrder.save(function (err) {
          if (err) {
            return next(err);
          }
          res.json({
            existingOrder,
          });
        });
      }
    });
  } catch (err) {
    return next(err);
  }
};
