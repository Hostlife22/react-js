import PropTypes from 'prop-types';
import React, { Component } from 'react';

export class Expand extends Component {
  state = {
    active: false,
  };

  toggle = () => {
    this.setState({
      active: !this.state.active,
    });
  };

  render() {
    const arrow = this.state.active ? 'up' : 'down';
    return (
      <div className="expand border">
        <div className="expand__header">
          <span className="expand__title">{this.props.title}</span>
          <button className="expand__toggle-btn" onClick={this.toggle}>
            <i className={`fas fa-chevron-${arrow}`}></i>
          </button>
        </div>
        {this.state.active && (
          <div className="expand__content">{this.props.children}</div>
        )}
      </div>
    );
  }
}

Expand.propTypes = {
  children: PropTypes.element.isRequired,
};

Expand.defaultProps = {
  title: 'Some text',
};

export default Expand;
