import React, { Component } from 'react';

class Toggler extends Component {
  constructor(props) {
    super(props);

    this.state = {
      toggle: 'Off',
    };
  }

  onChangeToggle = (e) => {
    const textContentBtn = e.target.textContent === 'Off' ? 'On' : 'Off';

    this.setState({
      toggle: textContentBtn,
    });
  };

  render() {
    return (
      <button className="toggler" onClick={this.onChangeToggle}>
        {this.state.toggle}
      </button>
    );
  }
}

export default Toggler;
