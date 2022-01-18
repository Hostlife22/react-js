import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import UsersList from './UsersList';

const rootElement = document.querySelector('#root');

const users = [
  { name: 'Ted', age: 18, id: 'user-1' },
  { name: 'Anna', age: 45, id: 'user-2' },
  { name: 'Sem', age: 15, id: 'user-3' },
  { name: 'John', age: 25, id: 'user-4' },
];

ReactDOM.render(<UsersList users={users} />, rootElement);
