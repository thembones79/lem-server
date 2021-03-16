import { Request, Response, NextFunction } from "express";
import { Line } from "../../models/line";

export const getLines = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  Line.find({}, function (err, lines) {
    if (err) {
      next(err);
      return;
    }
    res.json({
      lines,
    });
  });
};
