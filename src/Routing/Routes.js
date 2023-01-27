import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Loadable from 'react-loadable';
import Skeleton from 'react-loading-skeleton';
import { AuthenticatedRoute } from './AuthenticatedRoute';

const Dashboard = Loadable({
  loader: () => import(/* webpackChunkName: 'Dashboard' */ '../Components/Dashboard/Dashboard'),
  loading: Loading,
});
// import Dashboard from '../Components/Dashboard/Dashboard';

// eslint-disable-next-line
function Loading({ error }) {
  if (error) {
    console.error(error);
    return 'Unable to load the webpage. Please reload the page and try again.';
  }
  return <Skeleton count={50} />;
}

export function Routes() {
  return (
    <Switch>
      <AuthenticatedRoute exact path='/' component={Dashboard} />
      <Route exact path='/404' component={<h1>404</h1>} />
    </Switch>
  );
}
