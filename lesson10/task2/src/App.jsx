import React, { Component } from 'react';
import Profile from './Profile';
import ShoppingCart from './ShoppingCart';

export class Page extends Component {
  state = {
    userData: {
      firstName: 'John',
      lastName: 'Doe',
    },
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      userData: { ...this.state.userData, [name]: value },
    });
  };

  render() {
    const { userData } = this.state;
    const { firstName, lastName } = userData;

    return (
      <div className="page">
        <h1 className="title">{`Hello, ${firstName} ${lastName}`}</h1>
        <main className="content">
          <ShoppingCart userName={firstName} />
          <Profile userData={userData} handleChange={this.handleChange} />
        </main>
      </div>
    );
  }
}

export default Page;
