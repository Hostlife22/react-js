import { WEATHER_DATA_RECIEVED } from './weather.actions';

const initialState = {
  weatherData: null,
};

const weatherReducer = (state = initialState, action) => {
  switch (action.type) {
    case WEATHER_DATA_RECIEVED: {
      return {
        ...state,
        weatherData: action.payload.weatherData,
      };
    }
    default:
      return state;
  }
};

export default weatherReducer;
