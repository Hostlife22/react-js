import classNames from 'classnames';
import React, { useEffect, useState } from 'react';

const ConnectionStatus = () => {
  const [status, setStatus] = useState(true);

  useEffect(() => {
    const handleStatus = (e) => {
      const connectionStatus = e.type === 'online';
      setStatus(connectionStatus);
    };

    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);

    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);

  const statusName = classNames('status', { status_offline: !status });
  const condition = status ? 'online' : 'offline';

  return <div className={statusName}>{condition}</div>;
};

export default ConnectionStatus;
