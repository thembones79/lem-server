import { Router, Request, Response, NextFunction } from "express";
import jwt from "jwt-simple";
import { User, UserAttrs } from "../models/user";
import { keys } from "../config/keys";

export interface RequestWithUser extends Request {
  user: { [key: string]: string | undefined };
}

function tokenForUser(user: UserAttrs) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user._id, iat: timestamp }, keys.secret);
}

export const signup = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const password = req.body.password;
  const type = req.body.type;

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
        token: tokenForUser(user),
        userType: user.type,
        userName: user.firstname,
        userId: user._id,
      });
    });
  });
};

export const signin = function (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) {
  // User has already had their email and password auth'd
  // Just need to give them a token (because of requireSignin middleware)

  res.send({
    token: tokenForUser(req.user),
    userType: req.user.type,
    userName: req.user.firstname,
    userId: req.user._id,
  });
};
