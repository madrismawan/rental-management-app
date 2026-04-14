export const calculateTotalDays = (startDate: string, endDate: string) => {
  if (!startDate || !endDate) return 0;

  const start = new Date(startDate);
  const end = new Date(endDate);

  const timeDiff = end.getTime() - start.getTime();
  const dayDiff = timeDiff / (1000 * 3600 * 24);

  return dayDiff < 0 ? 0 : dayDiff;
};
