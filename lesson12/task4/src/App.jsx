import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Users from './Users';

const App = () => {
  return (
    <div className="page">
      <ul className="navigation">
        <li className="navigation__item">
          <Link to="/">Home</Link>
        </li>
        <li className="navigation__item">
          <Link to="/users">Users</Link>
        </li>
      </ul>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users/*" element={<Users />} />
      </Routes>
    </div>
  );
};

export default App;
