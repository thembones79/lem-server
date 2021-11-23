import { ProductStatistics } from "../../models/productStatistics";

interface IProductStatistics {
  givenHourlyRate?: number;
  shownComputedTactTime?: number;
  suggestedHourlyRate?: number;
  givenTactTime?: number;
  shownComputedHourlyRate?: number;
  suggestedTactTime?: number;
  automatic?: boolean;
  partNumber: string;
}

export const updateOneProductStatistics = function ({
  givenHourlyRate,
  shownComputedTactTime,
  suggestedHourlyRate,
  givenTactTime,
  shownComputedHourlyRate,
  suggestedTactTime,
  automatic,
  partNumber,
}: IProductStatistics): void {
  if (!partNumber) {
    throw new Error("You must provide part number!");
  }

  ProductStatistics.findOne(
    { partNumber },
    function (err, existingProductStatistics) {
      if (err) {
        throw new Error(err);
      }

      if (!existingProductStatistics) {
        throw new Error("Product does not exist!");
      }

      if (automatic) {
        existingProductStatistics.automatic = automatic;
      }

      if (suggestedHourlyRate) {
        existingProductStatistics.suggestedHourlyRate = suggestedHourlyRate;
      }

      if (givenHourlyRate) {
        existingProductStatistics.givenHourlyRate = givenHourlyRate;
      }

      if (shownComputedTactTime) {
        existingProductStatistics.shownComputedTactTime = shownComputedTactTime;
      }

      if (givenTactTime) {
        existingProductStatistics.givenTactTime = givenTactTime;
      }

      if (shownComputedHourlyRate) {
        existingProductStatistics.shownComputedHourlyRate =
          shownComputedHourlyRate;
      }

      if (suggestedTactTime) {
        existingProductStatistics.suggestedTactTime = suggestedTactTime;
      }

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
