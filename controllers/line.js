const ObjectId = require("mongoose").Types.ObjectId;
const Order = require("../models/order");
const Line = require("../models/line");
const Product = require("../models/product");

exports.addLine = function (req, res, next) {
  const lineNumber = parseInt(req.body.lineNumber, 10);

  if (!lineNumber) {
    return res.status(422).send({
      error: "You must provide line number",
    });
  }

  // See if a line with given number exists
  Line.findOne({ lineNumber }, function (err, existingLine) {
    if (err) {
      return next(err);
    }

    // If line exists, return an error
    if (existingLine) {
      return res.status(422).send({ error: "Line already exists" });
    }

    // If line does not exist, create and save line record
    const line = new Line({
      lineNumber,
    });

    line.save(function (err) {
      if (err) {
        return next(err);
      }
      const message = `Created line no. ${line.lineNumber}`;
      // Respond to request indicating the user was created
      res.json({
        message,
      });
    });
  });
};

exports.getLines = function (req, res, next) {
  Line.find({}, function (err, lines) {
    if (err) {
      return next(err);
    }

    res.json({
      lines,
    });
  });
};

exports.changeStatus = function (req, res, next) {
  const lineId = req.body.lineId;
  const lineStatus = req.body.lineStatus;

  if (!lineId || !lineStatus) {
    return res.status(422).send({
      error: "You must provide line number and line status!",
    });
  }

  Line.findOne({ _id: lineId }, function (err, existingLine) {
    if (err) {
      return next(err);
    }

    if (!existingLine) {
      return res.status(422).send({ error: "Line does not exist!" });
    }

    existingLine.lineStatus = lineStatus;

    existingLine.save(function (err) {
      if (err) {
        return next(err);
      }
      const message = `Updated line with id: ${existingLine._id} status to: ${existingLine.lineStatus}`;
      // Respond to request indicating the user was created
      res.json({
        message,
      });
    });
  });
};

exports.occupyLineWith = function (req, res, next) {
  const { lineId, orderNumber } = req.body;

  if (!lineId || !orderNumber) {
    return res.status(422).send({
      error: "You must provide line number and order number!",
    });
  }

  Line.findOne({ _id: lineId }, function (err, existingLine) {
    if (err) {
      return next(err);
    }

    if (!existingLine) {
      return res.status(422).send({ error: "Line does not exist!" });
    }

    existingLine.lineOccupiedWith = orderNumber;

    existingLine.save(function (err) {
      if (err) {
        return next(err);
      }
      const message = `Updated line: ${existingLine.lineDescription}, with order: ${existingLine.lineOccupiedWith}.`;
      // Respond to request indicating the user was created
      res.json({
        message,
      });
    });
  });
};

exports.getProductFromLine = function (req, res, next) {
  const _id = req.params._id;
  if (!_id) {
    return res.status(422).send({
      error: "You must provide line id!",
    });
  }

  if (!ObjectId.isValid(_id)) {
    return res.status(422).send({
      error: "Invalid id!",
    });
  }

  Line.findOne({ _id }, function (err, line) {
    if (err) {
      return next(err);
    }

    if (!line) {
      return res.status(422).send({ error: "Line does not exist" });
    }

    const orderNumber = line.lineOccupiedWith;
    if (!orderNumber || orderNumber === "") {
      return res.status(422).send({
        error: "Line is free!",
      });
    }

    Order.findOne(
      {
        orderNumber,
      },
      function (err, order) {
        if (err) {
          return next(err);
        }
        if (!order) {
          return res.status(422).send({ error: "Order does not exist" });
        }

        const { partNumber } = order;

        Product.findOne({ partNumber })
          .populate("linksToRedirs")
          .exec(function (err, existingProduct) {
            if (err) {
              console.log({ err });
              return next(err);
            }

            if (!existingProduct) {
              return res.status(422).send({ error: "Product does not exist!" });
            }
            res.json({ existingProduct, orderNumber });
          });
      }
    );
  });
};
