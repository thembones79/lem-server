const concatenateZeroIfLessThanTen = (number: number) => {
  return number < 10 ? "0" + number : number + "";
};

export const renderTime = (time: number) => {
  if (!time) {
    return;
  }
  const localTime = new Date(time);
  const year = concatenateZeroIfLessThanTen(localTime.getFullYear());
  const month = concatenateZeroIfLessThanTen(localTime.getMonth() + 1);
  const day = concatenateZeroIfLessThanTen(localTime.getDate());
  const hours = concatenateZeroIfLessThanTen(localTime.getHours());
  const minutes = concatenateZeroIfLessThanTen(localTime.getMinutes());
  const seconds = concatenateZeroIfLessThanTen(localTime.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
