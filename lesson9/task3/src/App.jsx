import React, { Component } from 'react';
import UserForm from './UserForm';

export class App extends Component {
  createUser = (data) => {
    console.log(data);
  };

  render() {
    return <UserForm onSubmit={this.createUser} />;
  }
}

export default App;
