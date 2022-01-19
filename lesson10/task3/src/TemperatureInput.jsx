import React from 'react';

const TemperatureInput = ({ temperature, scale, onTemperatureChange }) => {
  const scaleName = scale === 'c' ? 'Celsius' : 'Fahrenheit';
  return (
    <fieldset>
      <legend>Enter temperature in {scaleName}:</legend>
      <input
        value={temperature}
        onChange={(event) => onTemperatureChange(event.target.value)}
      />
    </fieldset>
  );
};

export default TemperatureInput;
