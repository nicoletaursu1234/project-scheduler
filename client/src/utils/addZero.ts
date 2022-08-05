const addZero = (i: number): string | number => {
  if (i < 10) return '0' + i;

  return i;
};

export default addZero;