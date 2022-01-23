import PropTypes from 'prop-types';
import React from 'react';

const City = ({ data }) => {
  const { name, temperature } = data;

  return (
    <div className="city">
      <span className="city__temperature">{`${temperature} F`}</span>
      <span className="city__name">{name}</span>
    </div>
  );
};

City.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
    temperature: PropTypes.number.isRequired,
  }).isRequired,
};

export default City;
