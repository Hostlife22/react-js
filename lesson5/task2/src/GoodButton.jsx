import React, { Component } from 'react';

class GoodButton extends Component {
  handleClick() {
    alert('Good job!');
  }

  render() {
    return (
      <div className="fancy-button" onClick={this.handleClick}>
        Click me!
      </div>
    );
  }
}
export default GoodButton;
