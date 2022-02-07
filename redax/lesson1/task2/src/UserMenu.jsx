import React, { Component } from 'react';
import { UserContect } from './user-context';

export class UserMenu extends Component {
  render() {
    const { avatar_url, name } = this.context;

    return (
      <div className="menu">
        <span className="menu__greeting">Hello, {name}</span>
        <img alt="User Avatar" src={avatar_url} className="menu__avatar" />
      </div>
    );
  }
}

UserMenu.contextType = UserContect;

export default UserMenu;
