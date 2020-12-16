import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Login from '../Components/Login/Login';
import Dashboard from '../Components/Dashboard/Dashboard';
import LiveClasses from '../Components/Live Classes/LiveClasses';
import SignIn from '../Components/Login/SignIn/SignIn';
import SignUp from '../Components/Login/SignUp/SignUp';
import AdmissionChat from '../Components/Login/AdmissionChat/AdmissionChat';
import AdmissionForm from '../Components/Login/AdmissionChat/AdmissionForm/AdmissionForm';
import StudyBin from '../Components/Study Bin/StudyBin';
import ForgotPassword from '../Components/Login/SignIn/ForgotPassword/ForgotPassword';
import { AuthenticatedRoute } from './AuthenticatedRoute';
import { VideoPlayer, FileView, AddYoutube } from '../Components/Common';
import QuestionTaker from '../Components/Common/QuestionTaker/QuestionTaker';
import NoticeBoard from '../Components/NoticeBoard/NoticeBoard';
import Profile from '../Components/Profile/Profile';
import EditProfile from '../Components/Profile/EditProfile';
import Fees from '../Components/Fees/Fees';
import FeesOrder from '../Components/Fees/Fees.order';
import HomeWorkCreator from '../Components/HomeWorkCreator/HomeWorkCreator';
import SavedSentTests from '../Components/HomeWorkCreator/SavedSentTests';
import FinalQuestions from '../Components/HomeWorkCreator/FinalQuestions';
import CreateQuestion from '../Components/HomeWorkCreator/CreateQuestion';

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
      <Route path='/videoplayer/:id' component={VideoPlayer} />

      <AuthenticatedRoute path='/liveclasses' component={LiveClasses} />
      <AuthenticatedRoute path='/studybin' component={StudyBin} />
      <AuthenticatedRoute path='/addyoutubevideo' component={AddYoutube} />
      <AuthenticatedRoute path='/noticeboard' component={NoticeBoard} />
      <AuthenticatedRoute path='/profile' component={Profile} />
      <AuthenticatedRoute path='/editprofile' component={EditProfile} />
      <AuthenticatedRoute path='/questiontaker' component={QuestionTaker} />
      <AuthenticatedRoute path='/fees' component={Fees} />
      <AuthenticatedRoute exact path='/order' component={FeesOrder} />
      <AuthenticatedRoute exact path='/homework' component={HomeWorkCreator} />
      <AuthenticatedRoute exect path='/homework/savedtests' component={SavedSentTests} />
      <AuthenticatedRoute exect path='/homework/preview' component={FinalQuestions} />
      <AuthenticatedRoute exect path='/homework/create' component={CreateQuestion} />

      <Route path='/fileviewer' component={FileView} />

      {/* redirect user to Dashboard page if route does not exist */}

      <Route component={Dashboard} />
    </Switch>
  );
}
