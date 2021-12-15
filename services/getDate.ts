import { concatenateZeroIfLessThanTen } from "./concatenateZeroIfLessThanTen";

export const getDate = (time: number | Date) => {
  if (!time) {
    return "";
  }
  const localTime = new Date(time);
  const year = concatenateZeroIfLessThanTen(localTime.getFullYear());
  const month = concatenateZeroIfLessThanTen(localTime.getMonth() + 1);
  const day = concatenateZeroIfLessThanTen(localTime.getDate());

  return `${year}.${month}.${day}`;
};
