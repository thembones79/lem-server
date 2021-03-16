import { Request, Response, NextFunction } from "express";
import { Line } from "../../models/line";

export const changeStatus = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const lineId = req.body.lineId;
  const lineStatus: string = req.body.lineStatus;

  if (!lineId || !lineStatus) {
    res.status(422).send({
      error: "You must provide line number and line status!",
    });
    return;
  }

  Line.findOne({ _id: lineId }, function (err, existingLine) {
    if (err) {
      next(err);
      return;
    }

    if (!existingLine) {
      res.status(422).send({ error: "Line does not exist!" });
      return;
    }

    existingLine.lineStatus = lineStatus;

    existingLine.save(function (err) {
      if (err) {
        next(err);
        return;
      }
      const message = `Updated line with id: ${existingLine._id} status to: ${existingLine.lineStatus}`;
      // Respond to request indicating the user was created
      res.json({
        message,
      });
    });
  });
};
