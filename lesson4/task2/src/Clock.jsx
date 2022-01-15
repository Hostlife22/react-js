import moment from 'moment';
import React, { Component } from 'react';
import './clock.scss';

const getTimeWithOffset = (offset) => {
  const currentDate = new Date();
  const time = new Date().setHours(currentDate.getHours() + offset);

  return moment(time).format('LTS');
};

class Clock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      location: props.location,
      offset: props.offset,
    };

    setInterval(() => {
      this.setState({
        offset: getTimeWithOffset(props.offset),
      });
    }, 1000);
  }
  render() {
    return (
      <div className="clock">
        <div className="clock__location">{this.state.location}</div>
        <div className="clock__time">{this.state.offset}</div>
      </div>
    );
  }
}

export default Clock;
