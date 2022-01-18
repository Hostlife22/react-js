import React, { Component } from 'react';
import Filter from './Filter';
import User from './User';

export class UsersList extends Component {
  state = {
    value: '',
  };

  onChange = (event) => {
    this.setState({
      value: event.target.value,
    });
  };

  render() {
    let users = this.props.users;

    if (this.state.value) {
      users = users.filter(({ name }) =>
        name.toLowerCase().includes(this.state.value.toLowerCase())
      );
    }

    return (
      <div>
        <Filter
          onChange={this.onChange}
          filterText={this.state.value}
          count={users.length}
        />
        <ul className="users">
          {users.map(({ name, age, id }) => (
            <User key={id} name={name} age={age} />
          ))}
        </ul>
      </div>
    );
  }
}

export default UsersList;
