import React, { Component } from 'react';
import Clock from './Clock';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visable: true,
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      visable: !this.state.visable,
    });
  }

  render() {
    return (
      <div>
        <button onClick={this.toggle}>Toggle</button>
        <div>{this.state.visable && <Clock />}</div>
      </div>
    );
  }
}

export default App;
