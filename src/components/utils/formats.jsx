// formaters
export const DATE_FORMATER = Intl.DateTimeFormat("en-ZA", {
  weekdays: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

// time formater
export const TIME_FORMATER = Intl.DateTimeFormat("en-Za", {
  hour: "numeric",
  minute: "numeric",
  // second: "numeric",
  timeZone: "Africa/Harare",
  timeZoneName: "short",
});

export const CURRENCY_FORMATER = Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "zar",
  minimumSignificantDigits: 1,
});
