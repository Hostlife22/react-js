import React, { Component } from 'react';

class Toggler extends Component {
  constructor(props) {
    super(props);

    this.state = {
      toggle: true,
    };
  }

  handlerChange = () => {
    this.setState({
      toggle: !this.state.toggle,
    });
  };

  render() {
    return (
      <button className="toggler" onClick={this.handleChange}>
        {this.state.toggle ? 'Off' : 'On'}
      </button>
    );
  }
}

export default Toggler;
