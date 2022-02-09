export const ADD_USER = 'USERS/ADD_USER';
export const DELETE_USER = 'USERS/DELETE_USER';
export const NEXT_PAGE = 'USERS/NEXT_PAGE';
export const PREV_PAGE = 'USERS/PREV_PAGE';

export const addUser = (userData) => {
  return {
    type: ADD_USER,
    payload: {
      userData,
    },
  };
};

export const deleteUser = (userId) => {
  return {
    type: DELETE_USER,
    payload: {
      userId,
    },
  };
};

export const goNext = () => {
  return {
    type: NEXT_PAGE,
  };
};

export const goPrev = () => {
  return {
    type: PREV_PAGE,
  };
};
