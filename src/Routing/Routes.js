import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Login from '../Components/Login/Login';
import Dashboard from '../Components/Dashboard/Dashboard';
import SignIn from '../Components/Login/SignIn/SignIn';
import SignUp from '../Components/Login/SignUp/SignUp';

export function Routes() {
  return (
    <Switch>
      <Route exact path='/' component={Login} />
      <Route path='/signin' component={SignIn} />

      <Route path='/signup' component={SignUp} />

      <Route path='/dashboard' component={Dashboard} />
      {/* redirect user to Login page if route does not exist and user is not authenticated */}
      {/* <Route component={Login} /> */}
    </Switch>
  );
}
