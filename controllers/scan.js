const mongoose = require("mongoose");
const Order = require("../models/order");
const scanSchema = require("../models/scan");
const Scan = mongoose.model("Scan", scanSchema);

exports.addScan = function (req, res, next) {
  const orderNumber = req.body.orderNumber;
  const scanContent = req.body.scanContent;
  let errorCode = req.body.errorCode || "e000";
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

    if (!existingOrder) {
      return res.status(422).send({ error: "Order does not exist" });
    }

    const {
      quantity,
      partNumber,
      qrCode,
      customer,
      tactTime,
      orderStatus,
      breaks,
      scans,
    } = existingOrder;

    if (orderStatus === "closed") {
      return res.status(422).send({ error: "Order is completed" });
    }

    // checks for double scans
    scans.forEach((element) => {
      if (element.scanContent === scanContent) {
        errorCode = "e001";
      }
    });

    // checks if scan's serial number is in the quantity range
    const serialNumber = parseInt(scanContent.substr(-5)) || 0;
    if (serialNumber < 1 || serialNumber > quantity) {
      errorCode = "e002";
    }

    // checks if scan consists valid QR code
    const qrCodeFromScan = scanContent.substr(0, scanContent.length - 5);
    if (qrCode !== qrCodeFromScan) {
      errorCode = "e003";
    }

    const scan = new Scan({
      scanContent,
      errorCode,
      _line,
      _user,
    });

    scans.unshift(scan);

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
