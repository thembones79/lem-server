import { Express } from "express";
import { RedirectionController } from "../controllers";
import { requireAuth } from "../services/requireAuth";

export const redirectionRouter = function (app: Express) {
  app.post(
    "/api/redirection",
    requireAuth,
    RedirectionController.addRedirection
  );
  app.put(
    "/api/redirection/:_id",
    requireAuth,
    RedirectionController.changeRedirection
  );
  app.delete(
    "/api/redirection/:_id",
    requireAuth,
    RedirectionController.deleteRedirection
  );
  app.get("/api/redirection/:redirRoute", RedirectionController.redirectTo);
  app.get(
    "/api/redirection",
    requireAuth,
    RedirectionController.getRedirections
  );
  app.get(
    "/api/redirwithprods/:_id",
    requireAuth,
    RedirectionController.getRedirWithProds
  );
};
