import React from 'react';
import { birthDate } from './birthDate';

const Greeting = (props) => {
  return (
    <div className="greeting">{`My name is ${props.firstName} ${
      props.lastName
    }. I'm ${birthDate(props.birthDate)} years old`}</div>
  );
};

export default Greeting;
