export const SET_VALUE = 'USER/SET_VALUE';

export const setInputValue = (inputValue) => {
  return {
    type: SET_VALUE,
    payload: {
      inputValue,
    },
  };
};
