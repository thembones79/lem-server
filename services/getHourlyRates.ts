import { OrderDoc } from "../models/order";
import { LineDoc } from "../models/line";
import { getValidScans } from "./getValidScans";
import { renderTime } from "./renderTime";
import { getDateWithHour } from "./getDateWithHour";
import { getLineDescription } from "./getLineDescription";

export const getHourlyRates = (order: OrderDoc, lines: LineDoc[]) => {
  const { scans } = order;

  const validScans = getValidScans(scans);

  const scansWithDateHour = validScans.map((scan) => {
    return {
      dateHour: getDateWithHour(scan.timeStamp),
      timeStamp: scan.scanContent + " - - - " + renderTime(scan.timeStamp),
      scansLine: scan._line,
    };
  });

  const groupBy = (items: any, key: any) =>
    items.reduce(
      (result: any, item: any) => ({
        ...result,
        [item[key]]: [...(result[item[key]] || []), item],
      }),
      {}
    );

  const scansGrouppedByDateHour = groupBy(scansWithDateHour, "dateHour");

  let hourlyRates = [];

  for (const key in scansGrouppedByDateHour) {
    if (Object.prototype.hasOwnProperty.call(scansGrouppedByDateHour, key)) {
      let scanDetails = [];

      const scansGrouppedByLine = groupBy(
        scansGrouppedByDateHour[key],
        "scansLine"
      );

      for (const key in scansGrouppedByLine) {
        if (Object.prototype.hasOwnProperty.call(scansGrouppedByLine, key)) {
          const scanList = scansGrouppedByLine[key];
          scanDetails.push({
            scansLine: getLineDescription(key, lines),
            scansSum: scanList.length,
            scansTimestamps: scanList
              .map((scan: any) => scan.timeStamp)
              .reverse(),
          });
        }
      }

      hourlyRates.push({
        dateHour: key,
        scanDetails: scanDetails,
      });
    }
  }

  return hourlyRates.reverse();
};
