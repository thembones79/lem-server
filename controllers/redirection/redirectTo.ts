import { Request, Response, NextFunction } from "express";
import { Redirection } from "../../models/redirection";

export const redirectTo = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  let redirRoute = req.params.redirRoute;

  if (!redirRoute) {
    res.status(422).send({
      error: "You must provide redirection route!",
    });
    return;
  }

  redirRoute = redirRoute.trim();

  Redirection.findOne({ redirRoute }, function (err, existingRedirection) {
    if (err) {
      return next(err);
    }

    if (!existingRedirection) {
      return res.status(422).send({ error: "Redirection not defined!" });
    }

    const { targetUrl } = existingRedirection;

    res.redirect(targetUrl);
  });
};
