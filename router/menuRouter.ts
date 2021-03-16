import { Express } from "express";
import { MenuController } from "../controllers";
import { requireAuth } from "../services/requireAuth";

export const menuRouter = function (app: Express) {
  app.post("/api/menu", requireAuth, MenuController.updateMenu);
  app.get("/api/menu", requireAuth, MenuController.getMenu);
};
