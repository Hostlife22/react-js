export const usersListSelector = (state) => {
  return state.users.usersList;
};

export const filterTextSelector = (state) => {
  return state.users.filterText;
};
