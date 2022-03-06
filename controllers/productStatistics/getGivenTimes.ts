import { ProductStatistics } from "../../models/productStatistics";

export const getGivenTimes = async function (partNumber: string) {
  if (!partNumber) {
    throw new Error("You must provide part number!");
  }

  const givenTimes = await ProductStatistics.findOne(
    { partNumber },
    function (err, existingProductStatistics) {
      if (err) {
        throw new Error(err);
      }

      if (!existingProductStatistics) {
        return { givenHourlyRate: 55, givenTactTime: 44, partNumber };
      } else {
        return existingProductStatistics;
      }
    }
  );

  return givenTimes || { givenHourlyRate: 55, givenTactTime: 44, partNumber };
};
