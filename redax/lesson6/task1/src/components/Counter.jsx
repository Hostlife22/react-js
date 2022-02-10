import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import * as counterActions from '../counter.actions';

const Counter = ({ counter, increment, decrement, reset }) => {
  return (
    <div className="counter">
      <button className="counter__button" onClick={decrement}>
        -
      </button>
      <span className="counter__value" onClick={reset}>
        {counter}
      </span>
      <button className="counter__button" onClick={increment}>
        +
      </button>
    </div>
  );
};

Counter.propTypes = {
  counter: PropTypes.number.isRequired,
  increment: PropTypes.func.isRequired,
  decrement: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
};

const mapState = (state) => {
  return {
    counter: state,
  };
};

const mapDispatch = {
  increment: counterActions.increment,
  decrement: counterActions.decrement,
  reset: counterActions.reset,
};

export default connect(mapState, mapDispatch)(Counter);
