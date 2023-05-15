const millisecond = 1000;
const hour = 3600;
const twentyFourHour = 24;
const day = millisecond * hour * twentyFourHour;

export const getLateDays = (date) => {
  const currentDate = new Date();
  const endDate = new Date(date);
  const difference = currentDate.getTime() - endDate.getTime();
  return currentDate > endDate ? Math.ceil(difference / day) : 0;
};
