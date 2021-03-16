import { Request, Response, NextFunction } from "express";
import jwt from "jwt-simple";
import { UserAttrs } from "../../models/user";
import { keys } from "../../config/keys";
import { assertIRequestWithUser } from "../../services/assertIRequestWithUser";

function tokenForUser(user: UserAttrs) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user._id, iat: timestamp }, keys.secret);
}

export const signin = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  assertIRequestWithUser(req);

  // User has already had their email and password auth'd
  // Just need to give them a token (because of requireSignin middleware)
  res.send({
    token: tokenForUser(req.user),
    userType: req.user.type,
    userName: req.user.firstname,
    userId: req.user._id,
  });
};
