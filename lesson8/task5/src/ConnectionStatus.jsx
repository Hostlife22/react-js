import React, { Component } from 'react';

export class ConnectionStatus extends Component {
  state = {
    condition: 'Online',
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
    const condition = navigator.onLine ? 'Online' : 'Offline';
    this.setState({
      condition,
    });
  };

  render() {
    const isOnline = this.state.condition === 'Online';
    const status = isOnline ? 'status' : 'status status_offline';

    return <div className={status}>{this.state.condition}</div>;
  }
}

export default ConnectionStatus;
