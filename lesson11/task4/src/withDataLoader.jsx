import React, { Component } from 'react';
import Spinner from './Spinner';

export const withDataLoader = (url) => (WrappedComponent) => {
  return class withDataLoader extends Component {
    state = {
      data: null,
    };

    componentDidMount() {
      this.fetchData(url);
    }

    fetchData = async (url) => {
      const data = await fetch(url).then((response) => response.json());

      this.setState({
        data,
      });
    };

    render() {
      return (
        <>
          {this.state.data ? (
            <WrappedComponent data={this.state.data} />
          ) : (
            <Spinner size={30} />
          )}
        </>
      );
    }
  };
};
