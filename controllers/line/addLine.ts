import { Request, Response, NextFunction } from "express";
import { Line } from "../../models/line";

export const addLine = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const lineNumber = parseInt(req.body.lineNumber, 10);

  if (!lineNumber) {
    res.status(422).send({
      error: "You must provide line number",
    });
    return;
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
