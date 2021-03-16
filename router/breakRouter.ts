import { Express } from "express";
import { BreakController } from "../controllers";
import { requireAuth } from "../services/requireAuth";

export const breakRouter = function (app: Express) {
  app.post("/api/break/start", requireAuth, BreakController.addBreakStart);
  app.post("/api/break/end", requireAuth, BreakController.addBreakEnd);
};
