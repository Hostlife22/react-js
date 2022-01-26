import moment from 'moment';
import React, { useEffect, useState } from 'react';
const Clock = ({ offset, location }) => {
  const [date, setDate] = useState(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currrentTime = moment().add(offset, 'hours').format('LTS');
      setDate(currrentTime);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  if (!date) {
    return null;
  }

  return (
    <div className="clock">
      <div className="clock__location">{location}</div>
      <div className="clock__time">{date}</div>
    </div>
  );
};

export default Clock;
