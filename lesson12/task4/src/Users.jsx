import React from 'react';
import { Link, Route, useRouteMatch } from 'react-router-dom';
import User from './User';

const Users = () => {
  const { path, url } = useRouteMatch();

  return (
    <div className="page__content">
      <h1>Users</h1>
      <ul className="navigation">
        <li className="navigation__item">
          <Link to={`${url}/github`}>Github</Link>
        </li>
        <li className="navigation__item">
          <Link to={`${url}/facebook`}>Facebook</Link>
        </li>
      </ul>

      <Route exact path={path}>
        <span>Select a user please</span>
      </Route>
      <Route path={`${path}/:userId`}>
        <User />
      </Route>
    </div>
  );
};

export default Users;
