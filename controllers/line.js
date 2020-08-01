const Line = require("../models/line");

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
