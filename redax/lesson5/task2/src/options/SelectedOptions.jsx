import { connect } from 'react-redux';
import Options from './Options';
import { toogleOption } from './options.actions';
import { selectedOptionsSelector } from './options.selectors';

const mapState = (state) => {
  return {
    options: selectedOptionsSelector(state),
  };
};

const mapDispatch = {
  moveOption: toogleOption,
};

export default connect(mapState, mapDispatch)(Options);
