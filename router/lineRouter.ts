import { Express } from "express";
import { LineController } from "../controllers";
import { requireAuth } from "../services/requireAuth";

export const lineRouter = function (app: Express) {
  app.post("/api/line", requireAuth, LineController.addLine);
  app.get("/api/lines", requireAuth, LineController.getLines);
  app.put("/api/line/status", requireAuth, LineController.changeStatus);

  app.put("/api/line/occupiedwith", requireAuth, LineController.occupyLineWith);
  app.get("/api/line/:_id", requireAuth, LineController.getProductFromLine);
  app.get(
    "/api/lineorder/:lineDescription",
    requireAuth,
    LineController.getOrderStatusFromLine
  );
};
