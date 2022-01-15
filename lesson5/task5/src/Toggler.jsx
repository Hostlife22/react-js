import React, { Component } from 'react';

class Toggler extends Component {
  constructor(props) {
    super(props);

    this.state = {
      toggle: props.default,
    };
  }

  render() {
    return (
      <button
        className="toggler"
        onClick={(e) => {
          this.setState({
            toggle: e.target.textContent === 'Off' ? 'On' : 'Off',
          });
        }}
      >
        {this.state.toggle}
      </button>
    );
  }
}

export default Toggler;
