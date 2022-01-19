import React from 'react';

const TemperatureInput = ({ temperature, scale, onTemperatureChange }) => {
  const scaleName = scale === 'c' ? 'Цельсия' : 'Фаренгейта';
  return (
    <fieldset>
      <legend>Введите температуру в градусах {scaleName}:</legend>
      <input
        value={temperature}
        onChange={(event) => onTemperatureChange(event.target.value)}
      />
    </fieldset>
  );
};

export default TemperatureInput;
