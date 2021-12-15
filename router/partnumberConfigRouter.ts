import { Express } from "express";
import { PartnumberConfigController } from "../controllers";
import { requireAuth } from "../services/requireAuth";

export const partnumberConfigRouter = function (app: Express) {
  app.post(
    "/api/pnconfig",
    requireAuth,
    PartnumberConfigController.addPartNumberConfig
  );
  app.put(
    "/api/pnconfig",
    requireAuth,
    PartnumberConfigController.updatePartNumberConfig
  );
  app.get(
    "/api/pnconfig",
    requireAuth,
    PartnumberConfigController.getPartNumberConfig
  );
};
