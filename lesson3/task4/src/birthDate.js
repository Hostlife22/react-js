export const birthDate = (date) => {
  const currentDate = new Date();
  const differentDate = currentDate - date;

  const ageResult = differentDate / (24 * 3600 * 365.25 * 1000);

  return ageResult >= 0 ? Math.trunc(ageResult) : 0;
};
