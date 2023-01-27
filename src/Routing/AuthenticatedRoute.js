/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-curly-newline */
/*eslint-disable*/

import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const token = 'some';

export const AuthenticatedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      token ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: '/404', state: { from: props.location } }} />
      )
    }
  />
);
