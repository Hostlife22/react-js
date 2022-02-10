import PropTypes from 'prop-types';
import React from 'react';

const User = ({ name, age }) => {
  return (
    <li className="user">
      <span className="user__name">{name}</span>
      <span className="user__age">{age}</span>
    </li>
  );
};

User.PropTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number.isRequired,
};

export default User;
