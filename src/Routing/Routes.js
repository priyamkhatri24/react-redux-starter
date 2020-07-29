import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Login from '../Components/Login/Login';
import Dashboard from '../Components/Dashboard/Dashboard';
import SignIn from '../Components/Login/SignIn/SignIn';

export function Routes() {
  return (
    <Switch>
      <Route path='/' exact component={Login} />
      {/* <Route path='/register' component={SignUp} /> */}
      <Route path='/signIn' exact component={SignIn} />

      <Route path='/dashboard' component={Dashboard} />
      {/* redirect user to Login page if route does not exist and user is not authenticated */}
      <Route component={Login} />
    </Switch>
  );
}
