
import { Request, Response, NextFunction } from "express";
import { User } from "../../models/user";

export const getUsers = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  User.find({}, function (err, users) {
    if (err) {
      next(err);
      return;
    }
    res.json({
      users,
    });
  });
};
