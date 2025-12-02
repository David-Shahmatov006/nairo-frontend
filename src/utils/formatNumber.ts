export const formatNumber = (value: number): string => {
  if (value < 1000) return value.toString();

  const units = ["K", "M", "B", "T"];
  let unitIndex = -1;
  let num = value;

  while (num >= 1000 && unitIndex < units.length - 1) {
    num /= 1000;
    unitIndex++;
  }

  const formatted = num % 1 === 0 ? num.toFixed(0) : num.toFixed(1);

  return `${formatted}${units[unitIndex]}`;
};
