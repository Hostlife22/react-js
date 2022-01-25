import React from 'react';
import { Link } from 'react-router-dom';

const Notfound = () => {
  return (
    <div>
      This page douesn't exist. Go <Link to="/">Home</Link>
    </div>
  );
};

export default Notfound;
