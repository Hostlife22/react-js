import React, { useState } from 'react';
import Dimensions from './Dimensions';

const Demo = () => {
  const [isVisable, setIsVisable] = useState(true);
  return (
    <div>
      <div>
        <button className="btn" onClick={() => setIsVisable(true)}>
          Show
        </button>
        <button className="btn" onClick={() => setIsVisable(false)}>
          Hide
        </button>
      </div>
      {isVisable && <Dimensions />}
    </div>
  );
};

export default Demo;
