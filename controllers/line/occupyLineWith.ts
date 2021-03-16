import { Request, Response, NextFunction } from "express";
import { Line } from "../../models/line";

export const occupyLineWith = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const {
    lineId,
    orderNumber,
  }: { lineId: string; orderNumber: string } = req.body;

  if (!lineId || !orderNumber) {
    res.status(422).send({
      error: "You must provide line number and order number!",
    });
    return;
  }

  Line.findById(lineId, function (err, existingLine) {
    if (err) {
      next(err);
      return;
    }

    if (!existingLine) {
      res.status(422).send({ error: "Line does not exist!" });
      return;
    }

    existingLine.lineOccupiedWith = orderNumber;

    existingLine.save(function (err) {
      if (err) {
        next(err);
        return;
      }
      const message = `Updated line: ${existingLine.lineDescription}, with order: ${existingLine.lineOccupiedWith}.`;
      // Respond to request indicating the user was created
      res.json({
        message,
      });
    });
  });
};
