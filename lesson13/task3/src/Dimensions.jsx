import React, { useEffect, useState } from 'react';

const Dimensions = () => {
  const [dimensions, setDimensions] = useState({ width: null, hieght: null });

  useEffect(() => {
    const { innerWidth, innerHeight } = window;
    setDimensions({ width: innerWidth, hieght: innerHeight });

    const handleResize = (e) => {
      const { innerWidth, innerHeight } = e.target;
      setDimensions({ width: innerWidth, hieght: innerHeight });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  const { width, hieght } = dimensions;

  return <div className="dimensions">{`${width}px - ${hieght}px`}</div>;
};

export default Dimensions;
