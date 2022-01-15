import React from 'react';
import Counter from './Counter';
import './counter.scss';

const App = () => {
  return (
    <>
      <Counter start={5} interval={1000} />
      <Counter start={12} interval={500} />
      <Counter start={-21} interval={200} />
    </>
  );
};

export default App;
