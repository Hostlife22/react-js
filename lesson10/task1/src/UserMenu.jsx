import React from 'react';

const UserMenu = ({ userData }) => {
  if (!userData) {
    return null;
  }
  const { name, avatar_url } = userData;
  return (
    <header className="header">
      <div className="menu">
        <span className="menu__greeting">{name}</span>
        <img alt="User Avatar" src={avatar_url} className="menu__avatar" />
      </div>
    </header>
  );
};

export default UserMenu;
