export const getStorageValue = (name: string): any => {
  const value = localStorage.getItem(name);

  return value ? JSON.parse(value) : null;
};

export const setStorageValue = <Value = string | Record<string | number, any>>(name: string, value: Value): boolean => {
  localStorage.setItem(name, JSON.stringify(value));

  return getStorageValue(name) === value;
};
