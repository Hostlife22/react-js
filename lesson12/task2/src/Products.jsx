import React from 'react';
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom';
import Product from './Product';

const Products = () => {
  const { url } = useRouteMatch();

  return (
    <div className="page__content">
      <h1>Products</h1>
      <ul className="navigation">
        <li className="navigation__item">
          <Link to={`${url}/book`}>Book</Link>
        </li>
        <li className="navigation__item">
          <Link to={`${url}/ball`}>Ball</Link>
        </li>
      </ul>

      <Switch>
        <Route exact path={url}>
          <span>Select a product please</span>
        </Route>
        <Route exact path={`${url}/:productId`}>
          <Product />
        </Route>
      </Switch>
    </div>
  );
};

export default Products;
