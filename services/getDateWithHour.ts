import { concatenateZeroIfLessThanTen } from "./concatenateZeroIfLessThanTen";

export const getDateWithHour = (time: number | Date) => {
  if (!time) {
    return;
  }
  const localTime = new Date(time);
  const year = concatenateZeroIfLessThanTen(localTime.getFullYear());
  const month = concatenateZeroIfLessThanTen(localTime.getMonth() + 1);
  const day = concatenateZeroIfLessThanTen(localTime.getDate());
  const hours = concatenateZeroIfLessThanTen(localTime.getHours() + 2);

  return `${year}.${month}.${day} --- ${hours}`;
};
