import React from 'react';
import { connect } from 'react-redux';
import * as userActions from '../store/users/users.actions';
import Pagination from './Pagination';
import User from './User';

const UsersList = ({ users, goPrev, goNext }) => {
  const { usersList, currentPage } = users;
  const ITEMS_PER_PAGE = 3;
  const lastUserIndex = (currentPage + 1) * ITEMS_PER_PAGE;
  const firstUserIndex = lastUserIndex - ITEMS_PER_PAGE;
  const currentUsersList = usersList.slice(firstUserIndex, lastUserIndex);

  return (
    <>
      <Pagination
        currentPage={currentPage + 1}
        goPrev={goPrev}
        goNext={goNext}
        itemsPerPage={ITEMS_PER_PAGE}
        totalItems={usersList.length}
      />
      <ul className="users">
        {currentUsersList.map((user) => (
          <User key={user.id} name={user.name} age={user.age} />
        ))}
      </ul>
    </>
  );
};

const mapState = (state) => {
  return {
    users: state.users,
  };
};

const mapDispatch = {
  goPrev: userActions.goPrev,
  goNext: userActions.goNext,
};

export default connect(mapState, mapDispatch)(UsersList);
