import { ProductStatistics } from "../../models/productStatistics";

export const addOneProductStatistics = function (partNumber: string): void {
  if (!partNumber) {
    throw new Error("You must provide part number!");
  }

  partNumber = partNumber.trim();

  ProductStatistics.findOne(
    { partNumber },
    function (err, existingProductStatistics) {
      if (err) {
        throw new Error(err);
      }

      if (existingProductStatistics) {
        throw new Error("Product already exists!");
      }

      const productStatistics = new ProductStatistics({
        partNumber,
      });

      productStatistics.save(function (err) {
        if (err) {
          throw new Error(err);
        }

        return {
          productStatistics,
        };
      });
    }
  );
};
