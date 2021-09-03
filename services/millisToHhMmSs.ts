export const millisToHhMmSs = (millis: number) => {
  if (!millis) {
    return "please provide a number of miliseconds";
  }
  return new Date(millis).toISOString().substr(11, 8);
};
