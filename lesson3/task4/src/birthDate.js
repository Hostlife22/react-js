export const birthDate = (date) => {
  const currentDate = new Date();
  const differentDate = currentDate - date;

  return differentDate > 0
    ? Math.trunc(differentDate / (24 * 3600 * 365.25 * 1000))
    : 0;
};
