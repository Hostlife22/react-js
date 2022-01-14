import React from 'react';
import './userAvatar.scss';

const UserAvatar = (props) => {
  return <img className="avatar" src={props.avatarUrl} alt={props.name} />;
};

export default UserAvatar;
