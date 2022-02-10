import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import * as weatherActions from './weather.actions';
import { weatherDataSelector } from './weather.selectors';
import WeatherItem from './WeatherItem';

const Weather = ({ weatherData, fetchUserData }) => {
  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <main className="weather">
      <h1 className="weather__title">Weather data</h1>
      <ul className="cities-list">
        {weatherData &&
          weatherData.map(({ id, name, temperature }) => (
            <WeatherItem key={id} name={name} temperature={temperature} />
          ))}
      </ul>
    </main>
  );
};

Weather.propTypes = {
  fetchUserData: PropTypes.func.isRequired,
  weatherData: PropTypes.arrayOf(PropTypes.shape()),
};

Weather.defaultValue = {
  weatherData: null,
};

const mapState = (state) => {
  return {
    weatherData: weatherDataSelector(state),
  };
};

const mapDispatch = {
  fetchUserData: weatherActions.getWeatherData,
};

export default connect(mapState, mapDispatch)(Weather);
