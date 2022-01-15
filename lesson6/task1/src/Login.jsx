import React from 'react';

const Login = ({ onLogin }) => {
  return (
    <button className="btn login" onClick={onLogin}>
      Login
    </button>
  );
};

export default Login;
