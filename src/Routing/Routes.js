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
import { FileView, AddYoutube, TempViewFile } from '../Components/Common';
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
import HomeWorkAssigner from '../Components/HomeWorkCreator/HomeWorkAssigner';
import ViewCourses from '../Components/Courses/ViewCourses';
import BuyCourse from '../Components/Courses/BuyCourse';
import Mycourse from '../Components/Courses/MyCourse';
import PlyrVideoPlayer from '../Components/Common/VideoPlayer/PlyrVideoPlayer';
import TeacherCourses from '../Components/Courses/TeacherCourses';
import CourseStatistics from '../Components/Courses/CourseStatistics';
import CreateCourse from '../Components/Courses/CreateCourse';
import AddContent from '../Components/Courses/AddContent';
import Admissions from '../Components/Admissions/Admissions';
import UserDetails from '../Components/Admissions/UsersDetails';
import BatchDetails from '../Components/Admissions/BatchesDetails';
import AddDetails from '../Components/Admissions/AddDetails';
import SelectClass from '../Components/Admissions/SelectClass';
import AddBatch from '../Components/Admissions/AddBatch';
import EditProfileHOC from '../Components/Admissions/EditProfileHoC';

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
      {/* <Route path='/videoplayerplyr/:id' component={VideoPlayer} /> */}
      <Route path='/videoplayer/:id?' component={PlyrVideoPlayer} />

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
      <AuthenticatedRoute exact path='/homework/savedtests' component={SavedSentTests} />
      <AuthenticatedRoute exact path='/homework/preview' component={FinalQuestions} />
      <AuthenticatedRoute exact path='/homework/create' component={CreateQuestion} />
      <AuthenticatedRoute exact path='/homework/assign' component={HomeWorkAssigner} />
      <AuthenticatedRoute exact path='/courses' component={ViewCourses} />
      <AuthenticatedRoute exact path='/courses/buyCourse' component={BuyCourse} />
      <AuthenticatedRoute exact path='/courses/mycourse' component={Mycourse} />
      <AuthenticatedRoute exact path='/courses/teachercourse' component={TeacherCourses} />
      <AuthenticatedRoute
        exact
        path='/courses/teachercourse/statistics'
        component={CourseStatistics}
      />
      <AuthenticatedRoute exact path='/courses/createcourse' component={CreateCourse} />
      <AuthenticatedRoute exact path='/courses/createcourse/addcontent' component={AddContent} />
      <AuthenticatedRoute exact path='/admissions' component={Admissions} />
      <AuthenticatedRoute exact path='/admissions/user' component={UserDetails} />
      <AuthenticatedRoute exact path='/admissions/batch' component={BatchDetails} />
      <AuthenticatedRoute exact path='/admissions/add/details' component={AddDetails} />
      <AuthenticatedRoute exact path='/admissions/add/class' component={SelectClass} />
      <AuthenticatedRoute exact path='/admissions/add/batch' component={AddBatch} />
      <AuthenticatedRoute exact path='/admissions/editprofile' component={EditProfileHOC} />

      <Route path='/fileviewer' component={FileView} />
      <Route path='/otherfileviewer' component={TempViewFile} />

      {/* redirect user to Dashboard page if route does not exist */}

      <Route component={Dashboard} />
    </Switch>
  );
}
