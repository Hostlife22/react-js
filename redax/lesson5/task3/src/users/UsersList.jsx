import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import Filter from '../Filter';
import User from './User';
import { setInputValue } from './users.actions';
import { filterTextSelector, usersListSelector } from './users.selectors';

const UsersList = ({ users, filterText, setValue }) => {
  const filtredUsersList = users.filter((user) =>
    user.name.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <>
      <Filter
        filterText={filterText}
        setValue={setValue}
        count={filtredUsersList.length}
      />

      <ul className="users">
        {filtredUsersList.map((user) => (
          <User key={user.id} name={user.name} age={user.age} />
        ))}
      </ul>
    </>
  );
};

UsersList.propTypes = {
  setValue: PropTypes.func.isRequired,
  users: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  filterText: PropTypes.string.isRequired,
};

const mapState = (state) => {
  return {
    users: usersListSelector(state),
    filterText: filterTextSelector(state),
  };
};

const mapDispatch = {
  setValue: setInputValue,
};

export default connect(mapState, mapDispatch)(UsersList);
