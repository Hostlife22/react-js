import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import Pagination from './Pagination';
import User from './User';
import * as userActions from './users.actions';
import { currentPageSelector, usersListSelector } from './users.selectors';

const itemsPerPage = 3;

const UsersList = ({ users, currentPage, goPrev, goNext }) => {
  const start = currentPage * itemsPerPage;
  const useresToDisplay = users.slice(start, start + itemsPerPage);

  return (
    <>
      <Pagination
        goPrev={goPrev}
        goNext={goNext}
        currentPage={currentPage + 1}
        totalItems={users.length}
        itemsPerPage={itemsPerPage}
      />
      <ul className="users">
        {useresToDisplay.map((user) => (
          <User key={user.id} {...user} />
        ))}
      </ul>
    </>
  );
};

UsersList.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  currentPage: PropTypes.number.isRequired,
  goNext: PropTypes.func.isRequired,
  goPrev: PropTypes.func.isRequired,
};

const mapState = (state) => {
  return {
    users: usersListSelector(state),
    currentPage: currentPageSelector(state),
  };
};

const mapDispatch = {
  goPrev: userActions.goPrev,
  goNext: userActions.goNext,
};

export default connect(mapState, mapDispatch)(UsersList);
