import React, { Component } from 'react';

class ColorPicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      colorPicker: '',
    };
  }

  getСolor = (color) => {
    this.setState({
      colorPicker: color,
    });
  };

  clearState = () => {
    this.setState({
      colorPicker: '',
    });
  };

  render() {
    return (
      <div onMouseOut={this.clearState}>
        <div className="picker__title">{this.state.colorPicker}</div>
        <div>
          <button
            className="picker__button picker__button_coral"
            onMouseOver={() => this.getСolor('coral')}
          ></button>
          <button
            className="picker__button picker__button_aqua"
            onMouseOver={() => this.getСolor('aqua')}
          ></button>
          <button
            className="picker__button picker__button_bisque"
            onMouseOver={() => this.getСolor('bisque')}
          ></button>
        </div>
      </div>
    );
  }
}

export default ColorPicker;
