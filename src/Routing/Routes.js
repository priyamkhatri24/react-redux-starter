import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Login from '../Components/Login/Login';
import Dashboard from '../Components/Dashboard/Dashboard';
import SignIn from '../Components/Login/SignIn/SignIn';
import SignUp from '../Components/Login/SignUp/SignUp';
import AdmissionChat from '../Components/Login/AdmissionChat/AdmissionChat';
import AdmissionForm from '../Components/Login/AdmissionChat/AdmissionForm/AdmissionForm';
import ForgotPassword from '../Components/Login/SignIn/ForgotPassword/ForgotPassword';
import { AuthenticatedRoute } from './AuthenticatedRoute';

export function Routes() {
  return (
    <Switch>
      <AuthenticatedRoute exact path='/' component={Dashboard} />
      <Route path='/signin' component={SignIn} />
      <Route path='/signup' component={SignUp} />
      <Route path='/login' component={Login} />
      <Route path='/admission' component={AdmissionChat} />
      <Route path='/admissionform' component={AdmissionForm} />
      <Route path='/forgotpassword' component={ForgotPassword} />

      {/* redirect user to Login page if route does not exist and user is not authenticated */}

      <Route component={Dashboard} />
    </Switch>
  );
}
