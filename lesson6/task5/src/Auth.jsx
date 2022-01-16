import React, { Component } from 'react';
import Login from './Login';
import Logout from './Logout';
import Spinner from './Spinner';

class Auth extends Component {
  state = {
    isLoggedIn: false,
    showDefaultLoader: false,
  };

  handleLogin = () => {
    this.setState({
      isLoggedIn: true,
      showDefaultLoader: true,
    });

    setTimeout(() => {
      this.setState({
        showDefaultLoader: false,
      });
    }, 2000);
  };

  handleLogout = () => {
    this.setState({
      isLoggedIn: false,
    });
  };

  render() {
    const button = this.state.isLoggedIn ? (
      <Logout onLogout={this.handleLogout} />
    ) : (
      <Login onLogin={this.handleLogin} />
    );

    const spinner = this.state.showDefaultLoader ? (
      <Spinner size={200} />
    ) : null;

    return <>{spinner || button}</>;
  }
}
export default Auth;
