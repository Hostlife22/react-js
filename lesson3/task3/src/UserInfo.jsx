import React from 'react';
import Avatar from './Avatar';
import './userInfo.scss';

const UserInfo = (props) => {
  return (
    <div className="user-info">
      <Avatar avatarUrl={props.user.avatar} author={props.user.author} />
      <div className="user-info__name">{props.user.author}</div>
    </div>
  );
};

export default UserInfo;
