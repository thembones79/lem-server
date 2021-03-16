import { Express } from "express";
import { UserController } from "../controllers";
import { requireAuth } from "../services/requireAuth";

export const userRouter = function (app: Express) {
  app.post("/api/user", requireAuth, UserController.addUser);
};
