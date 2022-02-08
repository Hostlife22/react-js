export const LANGUAGE = 'LANGUAGE/LANGUAGE';

export const setLanguage = (language) => {
  return {
    type: LANGUAGE,
    payload: {
      language,
    },
  };
};
