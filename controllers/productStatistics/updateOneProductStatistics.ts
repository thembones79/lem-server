import { ProductStatistics } from "../../models/productStatistics";

interface IProductStatistics {
  givenHourlyRate: number;
  suggestedHourlyRate: number;
  automatic: boolean;
  partNumber: string;
}

export const updateOneProductStatistics = function ({
  givenHourlyRate,
  suggestedHourlyRate,
  automatic,
  partNumber,
}: IProductStatistics): void {
  if (!partNumber) {
    throw new Error("You must provide part number!");
  }

  if (!automatic) {
    throw new Error("You must provide automatic flag (boolean)");
  }

  if (!suggestedHourlyRate) {
    throw new Error("You must provide suggested hourly rate!");
  }

  if (!givenHourlyRate) {
    throw new Error("You must provide given hourly rate!");
  }

  partNumber = partNumber.trim();

  ProductStatistics.findOne(
    { partNumber },
    function (err, existingProductStatistics) {
      if (err) {
        throw new Error(err);
      }

      if (!existingProductStatistics) {
        throw new Error("Product does not exist!");
      }

      existingProductStatistics.partNumber = partNumber;
      existingProductStatistics.automatic = automatic;
      existingProductStatistics.suggestedHourlyRate = suggestedHourlyRate;
      existingProductStatistics.givenHourlyRate = givenHourlyRate;

      existingProductStatistics.save(function (err) {
        if (err) {
          throw new Error(err);
        }

        return {
          existingProductStatistics,
        };
      });
    }
  );
};
