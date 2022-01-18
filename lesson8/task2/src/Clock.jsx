import React, { Component } from 'react';

class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
    };
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState({
        date: new Date(),
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return <div>{this.state.date.toLocaleTimeString()}</div>;
  }
}

export default Clock;
