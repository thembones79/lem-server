import { concatenateZeroIfLessThanTen } from "./concatenateZeroIfLessThanTen";

export const millisToHhMmSs = (duration: number) => {
  const seconds = concatenateZeroIfLessThanTen(
    Math.floor((duration / 1000) % 60)
  );
  const minutes = concatenateZeroIfLessThanTen(
    Math.floor((duration / (1000 * 60)) % 60)
  );
  const hours = concatenateZeroIfLessThanTen(
    Math.floor(duration / (1000 * 60 * 60))
  );

  return hours + ":" + minutes + ":" + seconds;
};
