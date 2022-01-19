import React from 'react';

const BoilingVerdict = ({ celsius }) => {
  if (celsius >= 100) {
    return <p>Вода закипит.</p>;
  }
  return <p>Вода не закипит.</p>;
};

export default BoilingVerdict;
