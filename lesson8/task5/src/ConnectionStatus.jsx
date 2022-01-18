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
    const condition = navigator.onLine ? 'online' : 'offline';
    this.setState({
      condition,
    });
  };

  render() {
    const status =
      this.state.condition === 'online' ? 'status' : 'status status_offline';

    return <div className={status}>{this.state.condition}</div>;
  }
}

export default ConnectionStatus;
