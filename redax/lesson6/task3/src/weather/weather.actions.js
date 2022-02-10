import { fetchData } from './weather.gateway';
export const WEATHER_DATA_RECIEVED = 'WEATHER_DATA_RECIEVED';

export const userDataRecieved = (weatherData) => {
  return {
    type: WEATHER_DATA_RECIEVED,
    payload: {
      weatherData,
    },
  };
};

export const getWeatherData = () => {
  return function (dispatch) {
    fetchData().then((data) => {
      dispatch(userDataRecieved(data));
    });
  };
};
