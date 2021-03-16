import { Request, Response, Express } from "express";
import { Authentication } from "../controllers";
import { requireAuth } from "../services/requireAuth";
import { requireSignin } from "../services/requireSignin";

export const authentication = function (app: Express) {
  app.get("/", requireAuth, function (req: Request, res: Response): void {
    res.send({
      message: "Hello ",
      user: req.user,
    });
  });
  app.post("/signin", requireSignin, Authentication.signin);
};
