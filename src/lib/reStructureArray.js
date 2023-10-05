export const restructorArray = (array, length) => {
  let size = 0,
    subArray = [];
  const parentArray = [];
  array?.forEach((each, index) => {
    subArray.push(each);
    size++;
    if (size === length) {
      parentArray.push(subArray);
      size = 0;
      subArray = [];
    }
  });
  subArray.length && parentArray.push(subArray);
  return parentArray;
};
