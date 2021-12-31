import { Express } from "express";
import { OrderController, OrderStatisticsController } from "../controllers";
import { requireAuth } from "../services/requireAuth";

export const orderRouter = function (app: Express) {
  app.post("/api/order", requireAuth, OrderController.addOrder);
  app.put("/api/order/close", requireAuth, OrderController.closeOrder);
  app.get("/api/orders", requireAuth, OrderController.getOrders);
  app.get("/api/orders/stats", requireAuth, OrderController.getOrdersWithStats);
  app.get(
    "/api/orders/statistics",
    requireAuth,
    OrderStatisticsController.getAllOrdersStats
  );
  app.get(
    "/api/orders/partnumbers",
    requireAuth,
    OrderController.getAllPartNumbers
  );
  app.get(
    "/api/order/:dashedordernumber",
    requireAuth,
    OrderController.getOrder
  );
  app.get("/api/order/stats/:id", requireAuth, OrderController.getOrderStats);
  app.get(
    "/api/order/statistics/:id",
    requireAuth,
    OrderStatisticsController.getOneOrderStats
  );
  app.post(
    "/api/orders/statistics/batch",
    requireAuth,
    OrderStatisticsController.batchAddAllOrdersStats
  );
  app.delete(
    "/api/order/:dashedordernumber",
    requireAuth,
    OrderController.deleteOrder
  );
  app.post("/api/scan", requireAuth, OrderController.addScan);
};
