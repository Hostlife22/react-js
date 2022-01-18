import moment from 'moment';
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

  getWorldTime = (offset) => {
    return moment(this.state.date).add(offset, 'hours').format('LTS');
  };

  render() {
    const time = this.getWorldTime(this.props.offset);

    return (
      <div className="clock">
        <div className="clock__location">{this.props.location}</div>
        <div className="clock__time">{time}</div>
      </div>
    );
  }
}

export default Clock;
