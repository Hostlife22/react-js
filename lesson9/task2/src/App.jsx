import React, { Component } from 'react';
import UserForm from './UserForm';

export class App extends Component {
  createUser = (state) => {
    console.log(state);
  };

  render() {
    return <UserForm onSubmit={this.createUser} />;
  }
}

export default App;
