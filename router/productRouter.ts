import { Express } from "express";
import { ProductController } from "../controllers";
import { ProductStatisticsController } from "../controllers";
import { requireAuth } from "../services/requireAuth";

export const productRouter = function (app: Express) {
  app.post("/api/product", requireAuth, ProductController.addProduct);
  app.post("/api/product/link", requireAuth, ProductController.addLink);
  app.post(
    "/api/product/redirection",
    requireAuth,
    ProductController.addRedirection
  );
  app.post(
    "/api/product/tt",
    requireAuth,
    ProductStatisticsController.getGivenTactTime
  );
  app.post(
    "/api/product/onestats",
    requireAuth,
    ProductStatisticsController.getOneStats
  );
  app.put(
    "/api/product/redirection/:_id",
    requireAuth,
    ProductController.updateManyProdsWithOneRedir
  );
  app.put("/api/product", requireAuth, ProductController.changeProduct);
  app.get("/api/product", requireAuth, ProductController.getProducts);
  app.get(
    "/api/product/statistics",
    requireAuth,
    ProductStatisticsController.getAllProductsStats
  );
  app.get("/api/product/:_id", requireAuth, ProductController.getProduct);
  app.get(
    "/api/product/statistics/:_id",
    requireAuth,
    ProductStatisticsController.getOneProductStats
  );
  app.put(
    "/api/product/statistics/:_id",
    requireAuth,
    ProductStatisticsController.updateProdStatsForRouter
  );
  app.delete("/api/product/:_id", requireAuth, ProductController.deleteProduct);
};
