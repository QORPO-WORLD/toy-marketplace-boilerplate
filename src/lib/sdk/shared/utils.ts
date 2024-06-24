export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

// timestamp after which the tx isn't valid anymore
export const getOrderDeadlineMinutes = (minutesFromNow = 30): number => {
  const nowInSeconds = Math.floor(Date.now() / 1000);
  const offsetInSeconds = 60 * minutesFromNow;
  return nowInSeconds + offsetInSeconds;
};

// timestamp after which the order isn't valid anymore
export const getOrderDeadlineHours = (hours = 1): number => {
  const nowInSeconds = Math.floor(Date.now() / 1000);
  const offsetInHours = 60 * 60 * hours;
  return nowInSeconds + offsetInHours;
};
