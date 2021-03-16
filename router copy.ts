import { Request, Response, Express } from "express";
import {
  LineController,
  Authentication,
  BreakController,
  LiveViewController,
  OrderController,
  ProductController,
  RedirectionController,
  MenuController,
  UserController,
} from "./controllers";

import "./services/passport";
import passport from "passport";

const requireAuth = passport.authenticate("jwt", { session: false });
const requireSignin = passport.authenticate("local", { session: false });

export const router = function (app: Express) {
  app.get("/", requireAuth, function (req: Request, res: Response): void {
    res.send({
      message: "Hello ",
      user: req.user,
    });
  });
  app.post("/signin", requireSignin, Authentication.signin);
  app.post("/api/line", requireAuth, LineController.addLine);
  app.get("/api/lines", requireAuth, LineController.getLines);
  app.put("/api/line/status", requireAuth, LineController.changeStatus);
  app.put("/api/line/occupiedwith", requireAuth, LineController.occupyLineWith);
  app.get("/api/line/:_id", requireAuth, LineController.getProductFromLine);
  app.post("/api/user", requireAuth, UserController.addUser);
  app.post("/api/order", requireAuth, OrderController.addOrder);
  app.put("/api/order/close", requireAuth, OrderController.closeOrder);
  app.get("/api/orders", requireAuth, OrderController.getOrders);
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
  app.post("/api/product", requireAuth, ProductController.addProduct);
  app.post("/api/product/link", requireAuth, ProductController.addLink);
  app.post(
    "/api/product/redirection",
    requireAuth,
    ProductController.addRedirection
  );
  app.put(
    "/api/product/redirection/:_id",
    requireAuth,
    ProductController.updateManyProdsWithOneRedir
  );
  app.put("/api/product", requireAuth, ProductController.changeProduct);
  app.get("/api/product", requireAuth, ProductController.getProducts);
  app.get("/api/product/:_id", requireAuth, ProductController.getProduct);
  app.delete("/api/product/:_id", requireAuth, ProductController.deleteProduct);
  app.get("/api/liveview", requireAuth, LiveViewController.getLiveView);
  app.get(
    "/api/order/:dashedordernumber",
    requireAuth,
    OrderController.getOrder
  );
  app.delete(
    "/api/order/:dashedordernumber",
    requireAuth,
    OrderController.deleteOrder
  );
  app.post("/api/scan", requireAuth, OrderController.addScan);
  app.post("/api/menu", requireAuth, MenuController.updateMenu);
  app.get("/api/menu", requireAuth, MenuController.getMenu);
  app.post("/api/break/start", requireAuth, BreakController.addBreakStart);
  app.post("/api/break/end", requireAuth, BreakController.addBreakEnd);
};
