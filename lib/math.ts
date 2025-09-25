export const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

export const average = (values: number[]) => {
  if (values.length === 0) {
    return 0;
  }

  return sum(values) / values.length;
};

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);
