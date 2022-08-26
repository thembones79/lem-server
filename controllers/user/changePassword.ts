
import { Request, Response, NextFunction } from "express";
import { User } from "../../models/user";
import { Types } from "mongoose";
import { assertIRequestWithUser } from "../../services/assertIRequestWithUser";

const ObjectId = Types.ObjectId;

export const changePassword = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const password = req.body.password;

  const { _id } = req.params;
  
  if (!_id) {
    res.status(422).send({
      error: "You must provide user id!",
    });
    return next();
  }

  if (!ObjectId.isValid(_id)) {
    res.status(422).send({
      error: "Invalid id!!",
    });
    return next();
  }
  assertIRequestWithUser(req);

  if (req.user.type !== "manager") {
    res.status(422).send({
      error: "You do not have privileges to change another user's password!",
    });
    return;
  }

  if (!password) {
    res.status(422).send({
      error:
        "You must provide password",
    });
    return;
  }

  User.findById(_id, function (err, existingUser) {
    if (err) {
      return next(err);
    }

    if (!existingUser) {
      return res.status(422).send({ error: "User does not exist" });
    }

    existingUser.password = password;

    existingUser.save(function (err) {
      if (err) {
        return next(err);
      }
      res.json({
        userType: existingUser.type,
        userName: existingUser.firstname,
        userId: existingUser._id,
      });
    });
  });
};
