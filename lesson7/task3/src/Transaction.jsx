import moment from 'moment';
import 'moment/locale/ru';
import React from 'react';

const Transaction = ({ from, to, amount, rate, time }) => {
  const momentDate = moment(time);
  const eventTime = momentDate.format('LT');
  const eventDate = momentDate.format('DD MMM');
  const amountRes = new Intl.NumberFormat('en-GB').format(amount);

  return (
    <li className="transaction">
      <span className="transaction__date">{eventDate}</span>
      <span className="transaction__time">{eventTime}</span>
      <span className="transaction__assets">{`${from} → ${to}`}</span>
      <span className="transaction__rate">{rate}</span>
      <span className="transaction__amount">{amountRes}</span>
    </li>
  );
};

export default Transaction;
