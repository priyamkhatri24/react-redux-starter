/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-curly-newline */
/*eslint-disable*/

import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export const AuthenticatedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      JSON.parse(localStorage.getItem('state')).userProfile.token ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: '/preload', state: { from: props.location } }} />
      )
    }
  />
);
