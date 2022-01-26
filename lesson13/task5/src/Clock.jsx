import moment from 'moment';
import React, { useEffect, useState } from 'react';
const Clock = ({ offset, location }) => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const currrentTime = moment(date).add(offset, 'hours').format('LTS');

  return (
    <div className="clock">
      <div className="clock__location">{location}</div>
      <div className="clock__time">{currrentTime}</div>
    </div>
  );
};

export default Clock;
