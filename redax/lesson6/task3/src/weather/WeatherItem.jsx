import PropTypes from 'prop-types';
import React from 'react';

const WeatherItem = ({ name, temperature }) => {
  return (
    <li className="city">
      <span className="city__name">{name}</span>
      <span className="city__temperature">{temperature} F</span>
    </li>
  );
};

WeatherItem.propTypes = {
  name: PropTypes.string.isRequired,
  temperature: PropTypes.number.isRequired,
};

export default WeatherItem;
