import { OrderDoc } from "../models/order";

export const getHourlyRates = (order: OrderDoc) => {
  const { scans } = order;

  return [
    {
      date: "2021.12.07",
      hour: "13",
      scansSum: 31,
      scansTimestamps: ["2021.12.07 13:06:22"],
    },
  ];
};
