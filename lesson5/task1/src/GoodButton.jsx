import React from 'react';

const GoodButton = () => {
  return (
    <div className="fancy-button" onClick={() => alert('Good job!')}>
      Click me!
    </div>
  );
};

export default GoodButton;
