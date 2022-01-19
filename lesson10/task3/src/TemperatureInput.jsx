import React from 'react';

const TemperatureInput = ({ scale, temperature, onTemperatureChange }) => {
  return (
    <fieldset>
      <legend>
        Enter temperature in {scale === 'c' ? 'Celsius' : 'Fahrenheit'}:
      </legend>
      <input
        value={temperature}
        onChange={(event) => onTemperatureChange(event.target.value)}
      />
    </fieldset>
  );
};

export default TemperatureInput;
