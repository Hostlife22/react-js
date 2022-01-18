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
      <>
        <button className="btn" onClick={this.toggle}>
          Toggle
        </button>
        {this.state.visable && (
          <div className="word-clock">
            <Clock location="New York" offset={-5} />
            <Clock location="Kyiv" offset={2} />
            <Clock location="London" offset={0} />
          </div>
        )}
      </>
    );
  }
}

export default App;
