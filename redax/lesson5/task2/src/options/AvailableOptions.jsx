import { connect } from 'react-redux';
import Options from './Options';
import { toogleOption } from './options.actions';
import { availableOptionsSelector } from './options.selectors';

const mapState = (state) => {
  return {
    options: availableOptionsSelector(state),
  };
};

const mapDispatch = {
  moveOption: toogleOption,
};

export default connect(mapState, mapDispatch)(Options);
