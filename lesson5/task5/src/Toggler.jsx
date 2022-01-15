import React, { Component } from 'react';

class Toggler extends Component {
  toggleBtn(e) {
    const content = e.target.textContent === 'Off' ? 'On' : 'Off';
    e.target.textContent = content;
  }

  render() {
    return (
      <button className="toggler" onClick={this.toggleBtn}>
        Off
      </button>
    );
  }
}

export default Toggler;
