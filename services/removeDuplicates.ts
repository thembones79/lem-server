export const removeDuplicates = (array: []) => {
  return array.filter((item, index) => array.indexOf(item) === index);
};
