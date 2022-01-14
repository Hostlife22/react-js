import React from 'react';
import { birthDate } from './birthDate';
import Greeting from './Greeting';

const App = () => {
  const age = birthDate(new Date('2022-01-01T11:11:11.819Z'));

  return <Greeting firstName="John" lastName="Doe" birthDate={age} />;
};

export default App;
