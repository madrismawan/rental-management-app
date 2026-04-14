export const calculateTotalDays = (startDate: string, endDate: string) => {
  if (!startDate || !endDate) return 0;

  const start = new Date(startDate);
  const end = new Date(endDate);

  const timeDiff = end.getTime() - start.getTime();
  const dayDiff = timeDiff / (1000 * 3600 * 24);

  return dayDiff < 0 ? 0 : dayDiff;
};

export const formatDate = (value: Date | string | undefined) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};
