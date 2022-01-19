import React from 'react';

const BoilingVerdict = ({ celsius }) => {
  if (celsius >= 100) {
    return <p>The water would boil.</p>;
  }
  return <div>The water would not boil. </div>;
};

export default BoilingVerdict;
