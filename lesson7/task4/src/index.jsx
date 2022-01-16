import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import UsersList from './UsersList';

const rootElement = document.querySelector('#root');

const users = [
  { name: 'Bob', age: 21, id: 'user-1' },
  { name: 'Sam', age: 45, id: 'user-2' },
  { name: 'Alex', age: 12, id: 'user-3' },
  { name: 'John', age: 6, id: 'user-4' },
  { name: 'Ted', age: 17, id: 'user-44' },
  { name: 'Martin', age: 34, id: 'user-42' },
  { name: 'Ann', age: 27, id: 'user-14' },
];

ReactDOM.render(<UsersList users={users} />, rootElement);
