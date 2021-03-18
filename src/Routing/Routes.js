import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Loadable from 'react-loadable';
import Skeleton from 'react-loading-skeleton';
import { AuthenticatedRoute } from './AuthenticatedRoute';
import TeacherCourses from '../Components/Courses/TeacherCourses';

// import EditProfileHOC from '../Components/Admissions/EditProfileHoC';

const Admissions = Loadable({
  loader: () => import(/* webpackChunkName: 'Admissions' */ '../Components/Admissions/Admissions'),
  loading: Loading,
});

// import Admissions from '../Components/Admissions/Admissions';

const ForgotPassword = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: 'ForgotPassword' */ '../Components/Login/SignIn/ForgotPassword/ForgotPassword'
    ),
  loading: Loading,
});
// import ForgotPassword from '../Components/Login/SignIn/ForgotPassword/ForgotPassword';

const FileView = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'PDFFileViewer' */ '../Components/Common/FileViewer/PDFFileViewer'),
  loading: Loading,
});
const TempViewFile = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'OtherFileView' */ '../Components/Common/FileViewer/FileViewer'),
  loading: Loading,
});
// import { FileView, TempViewFile } from '../Components/Common';

const Login = Loadable({
  loader: () => import(/* webpackChunkName: 'Login' */ '../Components/Login/Login'),
  loading: Loading,
});
// import Login from '../Components/Login/Login';

const SignIn = Loadable({
  loader: () => import(/* webpackChunkName: 'SignIn' */ '../Components/Login/SignIn/SignIn'),
  loading: Loading,
});
// import SignIn from '../Components/Login/SignIn/SignIn';

const SignUp = Loadable({
  loader: () => import(/* webpackChunkName: 'SignUp' */ '../Components/Login/SignUp/SignUp'),
  loading: Loading,
});
// import SignUp from '../Components/Login/SignUp/SignUp';

const AdmissionChat = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: 'AdmissionChat' */ '../Components/Login/AdmissionChat/AdmissionChat'
    ),
  loading: Loading,
});
// import AdmissionChat from '../Components/Login/AdmissionChat/AdmissionChat';

const AdmissionForm = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: 'AdmissionForm' */ '../Components/Login/AdmissionChat/AdmissionForm/AdmissionForm'
    ),
  loading: Loading,
});
// import AdmissionForm from '../Components/Login/AdmissionChat/AdmissionForm/AdmissionForm';

const StudyBin = Loadable({
  loader: () => import(/* webpackChunkName: 'StudyBin' */ '../Components/Study Bin/StudyBin'),
  loading: Loading,
});
// import StudyBin from '../Components/Study Bin/StudyBin';

const Categories = Loadable({
  loader: () => import(/* webpackChunkName: 'Categories' */ '../Components/Study Bin/Categories'),
  loading: Loading,
});
// import Categories from '../Components/Study Bin/Categories';

const AddYoutube = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'AddYoutube' */ '../Components/Common/AddYoutube/AddYoutube'),
  loading: Loading,
});

const QuestionTaker = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: 'QuestionTaker' */ '../Components/Common/QuestionTaker/QuestionTaker'
    ),
  loading: Loading,
});
// import QuestionTaker from '../Components/Common/QuestionTaker/QuestionTaker';

const NoticeBoard = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'NoticeBoard' */ '../Components/NoticeBoard/NoticeBoard'),
  loading: Loading,
});
// import NoticeBoard from '../Components/NoticeBoard/NoticeBoard';

const Profile = Loadable({
  loader: () => import(/* webpackChunkName: 'Profile' */ '../Components/Profile/Profile'),
  loading: Loading,
});
// import Profile from '../Components/Profile/Profile';

const EditProfile = Loadable({
  loader: () => import(/* webpackChunkName: 'EditProfile' */ '../Components/Profile/EditProfile'),
  loading: Loading,
});
// import EditProfile from '../Components/Profile/EditProfile';

const FeesOrder = Loadable({
  loader: () => import(/* webpackChunkName: 'FeesOrder' */ '../Components/Fees/Fees.order'),
  loading: Loading,
});
// import FeesOrder from '../Components/Fees/Fees.order';

const HomeWorkCreator = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: 'HomeWorkCreator' */ '../Components/HomeWorkCreator/HomeWorkCreator'
    ),
  loading: Loading,
});
// import HomeWorkCreator from '../Components/HomeWorkCreator/HomeWorkCreator';

const SavedSentTests = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'SavedSentTests' */ '../Components/HomeWorkCreator/SavedSentTests'),
  loading: Loading,
});
// import SavedSentTests from '../Components/HomeWorkCreator/SavedSentTests';

const FinalQuestions = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'FinalQuestions' */ '../Components/HomeWorkCreator/FinalQuestions'),
  loading: Loading,
});
// import FinalQuestions from '../Components/HomeWorkCreator/FinalQuestions';

const CreateQuestion = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'CreateQuestion' */ '../Components/HomeWorkCreator/CreateQuestion'),
  loading: Loading,
});
// import CreateQuestion from '../Components/HomeWorkCreator/CreateQuestion';

const HomeWorkAssigner = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: 'HomeWorkAssigner' */ '../Components/HomeWorkCreator/HomeWorkAssigner'
    ),
  loading: Loading,
});
// import HomeWorkAssigner from '../Components/HomeWorkCreator/HomeWorkAssigner';

const ViewCourses = Loadable({
  loader: () => import(/* webpackChunkName: 'ViewCourses' */ '../Components/Courses/ViewCourses'),
  loading: Loading,
});
// import ViewCourses from '../Components/Courses/ViewCourses';

const BuyCourse = Loadable({
  loader: () => import(/* webpackChunkName: 'BuyCourse' */ '../Components/Courses/BuyCourse'),
  loading: Loading,
});
// import BuyCourse from '../Components/Courses/BuyCourse';

const Mycourse = Loadable({
  loader: () => import(/* webpackChunkName: 'MyCourse' */ '../Components/Courses/MyCourse'),
  loading: Loading,
});
// import Mycourse from '../Components/Courses/MyCourse';

const Dashboard = Loadable({
  loader: () => import(/* webpackChunkName: 'Dashboard' */ '../Components/Dashboard/Dashboard'),
  loading: Loading,
});
// import Dashboard from '../Components/Dashboard/Dashboard';

const LiveClasses = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'LiveClasses' */ '../Components/Live Classes/LiveClasses'),
  loading: Loading,
});
// import LiveClasses from '../Components/Live Classes/LiveClasses';

const PlyrVideoPlayer = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: 'VideoPlayer' */ '../Components/Common/VideoPlayer/PlyrVideoPlayer'
    ),
  loading: Loading,
});

const CourseStatistics = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'CourseStats' */ '../Components/Courses/CourseStatistics'),
  loading: Loading,
});
// import CourseStatistics from '../Components/Courses/CourseStatistics';

const CreateCourse = Loadable({
  loader: () => import(/* webpackChunkName: 'CreateCourse' */ '../Components/Courses/CreateCourse'),
  loading: Loading,
});
// import CreateCourse from '../Components/Courses/CreateCourse';

const AddContent = Loadable({
  loader: () => import(/* webpackChunkName: 'AddContent' */ '../Components/Courses/AddContent'),
  loading: Loading,
});
// import AddContent from '../Components/Courses/AddContent';

const UserDetails = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'UserDetails' */ '../Components/Admissions/UsersDetails'),
  loading: Loading,
});
// import UserDetails from '../Components/Admissions/UsersDetails';

const BatchDetails = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'BatchDetails' */ '../Components/Admissions/BatchesDetails'),
  loading: Loading,
});
// import BatchDetails from '../Components/Admissions/BatchesDetails';

const AddDetails = Loadable({
  loader: () => import(/* webpackChunkName: 'AddDetails' */ '../Components/Admissions/AddDetails'),
  loading: Loading,
});
// import AddDetails from '../Components/Admissions/AddDetails';

const SelectClass = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'SelectClass' */ '../Components/Admissions/SelectClass'),
  loading: Loading,
});
// import SelectClass from '../Components/Admissions/SelectClass';

const AddBatch = Loadable({
  loader: () => import(/* webpackChunkName: 'AddBatch' */ '../Components/Admissions/AddBatch'),
  loading: Loading,
});
// import AddBatch from '../Components/Admissions/AddBatch';

const EditProfileHOC = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'EditProfileHoc' */ '../Components/Admissions/EditProfileHoC'),
  loading: Loading,
});

const Fees = Loadable({
  loader: () => import(/* webpackChunkName: 'Fees' */ '../Components/Fees/Fees'),
  loading: Loading,
});

const TeacherFees = Loadable({
  loader: () => import(/* webpackChunkName: 'Fees' */ '../Components/Fees/TeacherFees'),
  loading: Loading,
});

const Conversations = Loadable({
  loader: () => import(/* webpackChunkName: 'Fees' */ '../Components/Conversations/Conversations'),
  loading: Loading,
});

const Conversation = Loadable({
  loader: () => import(/* webpackChunkName: 'Fees' */ '../Components/Conversations/Conversation'),
  loading: Loading,
});

// eslint-disable-next-line
function Loading({ error }) {
  if (error) {
    return 'oh-noes!';
  }
  return <Skeleton count={50} />;
}

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

      <AuthenticatedRoute exact path='/liveclasses' component={LiveClasses} />
      <AuthenticatedRoute exact path='/studybin' component={StudyBin} />
      <AuthenticatedRoute exact path='/studybin/categories/:id' component={Categories} />
      <AuthenticatedRoute exact path='/addyoutubevideo' component={AddYoutube} />
      <AuthenticatedRoute exact path='/noticeboard' component={NoticeBoard} />
      <AuthenticatedRoute exact path='/profile' component={Profile} />
      <AuthenticatedRoute exact path='/editprofile' component={EditProfile} />
      <AuthenticatedRoute exact path='/questiontaker' component={QuestionTaker} />
      <AuthenticatedRoute exact path='/fees' component={Fees} />
      <AuthenticatedRoute exact path='/teacherfees' component={TeacherFees} />
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

      {/* Chat routes */}

      <AuthenticatedRoute exact path='/conversations' component={Conversations} />
      <AuthenticatedRoute exact path='/conversation' component={Conversation} />

      <Route path='/fileviewer' component={FileView} />
      <Route path='/otherfileviewer' component={TempViewFile} />

      {/* redirect user to Dashboard page if route does not exist */}

      <Route component={Dashboard} />
    </Switch>
  );
}
