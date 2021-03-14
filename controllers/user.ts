import { Router, Request, Response, NextFunction } from "express";
import { User } from "../models/user";
import { RequestWithUser } from "./authentication";

export const addUser = function (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
): void {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const password = req.body.password;
  const type = req.body.type;

  if (req.user.type !== "manager") {
    res.status(422).send({
      error: "You do not have privileges to add new user!",
    });
    return;
  }

  if (!email || !firstname || !lastname || !password || !type) {
    res.status(422).send({
      error:
        "You must provide firstname, lastname, email, password and user type",
    });
    return;
  }

  // See if a user with given email exists
  User.findOne({ email: email }, function (err, existingUser) {
    if (err) {
      return next(err);
    }

    // If user exists, return an error
    if (existingUser) {
      return res.status(422).send({ error: "Email in in use" });
    }

    // If user does not exist, create and save user record
    const user = new User({
      firstname,
      lastname,
      email,
      password,
      type,
    });

    user.save(function (err) {
      if (err) {
        return next(err);
      }
      // Respond to request indicating the user was created
      res.json({
        userType: user.type,
        userName: user.firstname,
        userId: user._id,
      });
    });
  });
};
