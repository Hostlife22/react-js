import moment from 'moment';
import React, { Component } from 'react';
import './clock.scss';

const getTimeWithOffset = (offset) => {
  const currentTime = new Date();
  const utcOffset = currentTime.getTimezoneOffset() / 60;

  return new Date(
    currentTime.setHours(currentTime.getHours() + offset + utcOffset)
  );
};

class Clock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      time: '',
    };

    setInterval(() => {
      this.setState({
        time: this.getTimeFormat(props.offset, 'LTS'),
      });
    }, 1000);
  }

  getTimeFormat(offset, format) {
    const date = getTimeWithOffset(offset);
    return moment(date).format(format);
  }

  render() {
    return (
      <div className="clock">
        <div className="clock__location">{this.props.location}</div>
        <div className="clock__time">{this.state.time}</div>
      </div>
    );
  }
}

export default Clock;
