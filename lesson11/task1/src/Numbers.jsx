import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

export class Numbers extends PureComponent {
  render() {
    return (
      <div className="number">
        <span className="number__title">{this.props.title}</span>
        <span className="number__value">{this.props.number}</span>
      </div>
    );
  }
}

Numbers.propTypes = {
  title: PropTypes.string,
  number: PropTypes.number.isRequired,
};

Numbers.defaultProps = {
  title: 'Some number',
};

export default Numbers;
