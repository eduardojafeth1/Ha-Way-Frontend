export const PREPARATION_TIME = 60; // minutos

export const HOURS = [
  { label: "08:00 AM", hour: 8 },
  { label: "09:00 AM", hour: 9 },
  { label: "10:00 AM", hour: 10 },
  { label: "11:00 AM", hour: 11 },
  { label: "12:00 PM", hour: 12 },
  { label: "01:00 PM", hour: 13 },
  { label: "02:00 PM", hour: 14 },
  { label: "03:00 PM", hour: 15 },
  { label: "04:00 PM", hour: 16 },

];

export const OPENING_HOUR = HOURS[0].hour; // 8
export const CLOSING_HOUR = HOURS[HOURS.length - 1].hour; // 20