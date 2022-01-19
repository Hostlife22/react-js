import React, { Component } from 'react';
import UserMenu from './UserMenu';
import UserProfile from './UserProfile';

class App extends Component {
  state = {
    userData: null,
  };

  componentDidMount() {
    this.fetchUserData(this.props.userId);
  }

  fetchUserData = (userId) => {
    const userUrl = `https://api.github.com/users/${userId}`;
    fetch(userUrl)
      .then((response) => response.json())
      .then((userData) => this.setState({ userData }));
  };

  render() {
    return (
      <div className="page">
        <UserMenu userData={this.state.userData} />
        <UserProfile userData={this.state.userData} />
      </div>
    );
  }
}

export default App;
