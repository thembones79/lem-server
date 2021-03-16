import { Express } from "express";
import { LiveViewController } from "../controllers";
import { requireAuth } from "../services/requireAuth";

export const liveViewRouter = function (app: Express) {
  app.get("/api/liveview", requireAuth, LiveViewController.getLiveView);
};
