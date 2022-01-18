import React, { Component } from 'react';

export class ConnectionStatus extends Component {
  state = {
    condition: 'online',
  };

  componentDidMount() {
    window.addEventListener('online', this.setStatus);
    window.addEventListener('offline', this.setStatus);
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.setStatus);
    window.removeEventListener('offline', this.setStatus);
  }

  setStatus = (e) => {
    this.setState({
      condition: e.type,
    });
  };

  render() {
    const condition = this.state.condition;
    let status = 'status';

    if (condition === 'offline') {
      status += ' status_offline';
    }

    return <div className={status}>{condition}</div>;
  }
}

export default ConnectionStatus;
