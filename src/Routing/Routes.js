import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Loadable from 'react-loadable';
import Skeleton from 'react-loading-skeleton';
import { AuthenticatedRoute } from './AuthenticatedRoute';
// import TeacherCourses from '../Components/Courses/TeacherCourses';

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

const Preloader = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'Preloader' */ '../Components/Login/Preloader/Preloader'),
  loading: Loading,
});

const SignupForm = Loadable({
  loader: () => import(/* webpackChunkName: 'SignUpForm' */ '../Components/Login/SignupForm'),
  loading: Loading,
});

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

const Videos = Loadable({
  loader: () => import(/* webpackChunkName: 'StudyBin' */ '../Components/Videos/Videos'),
  loading: Loading,
});
// import StudyBin from '../Components/Videos/Videos';

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

const FeeOrderSummary = Loadable({
  loader: () => import(/* webpackChunkName: 'FeesOrder' */ '../Components/Fees/CFOrderSummary'),
  loading: Loading,
});

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

const SavedSentTestsUsingFilters = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: 'SavedSentTestsUsingFilters' */ '../Components/HomeWorkCreator/SavedSentTestsUsingFilters'
    ),
  loading: Loading,
});

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

const HomeWorkViewOnly = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: 'HomeWorkViewOnly' */ '../Components/HomeWorkCreator/HomeWorkViewOnly'
    ),
  loading: Loading,
});

const ViewCourses = Loadable({
  loader: () => import(/* webpackChunkName: 'ViewCourses' */ '../Components/Courses/ViewCourses'),
  loading: Loading,
});
// import ViewCourses from '../Components/Courses/ViewCourses';

const TeacherCourses = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'TeacherCourses' */ '../Components/Courses/TeacherCourses'),
  loading: Loading,
});

// import TeacherCourses from '../Components/Courses/TeacherCourses';

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
  loader: () => import(/* webpackChunkName: 'TeacherFees' */ '../Components/Fees/TeacherFees'),
  loading: Loading,
});

const FeeUserDetails = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'FeeUserDetails' */ '../Components/Fees/FeeUserDetails'),
  loading: Loading,
});

const StudentFee = Loadable({
  loader: () => import(/* webpackChunkName: 'StudentFee' */ '../Components/Fees/StudentFee'),
  loading: Loading,
});

const FeePlans = Loadable({
  loader: () => import(/* webpackChunkName: 'FeePlans' */ '../Components/Fees/FeePlans'),
  loading: Loading,
});

// import StudentFee from '../Components/Fees/StudentFee';

const EditFeePlan = Loadable({
  loader: () => import(/* webpackChunkName: 'EditFeePlan' */ '../Components/Fees/EditFeePlan'),
  loading: Loading,
});

const TeacherAnalysis = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'TeacherAnalysis' */ '../Components/Analysis/TeacherAnalysis'),
  loading: Loading,
});

const AssignmentList = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'AssignmentList' */ '../Components/Analysis/AssignmentList'),
  loading: Loading,
});

const StudentAnalysis = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'StudentAnalysis' */ '../Components/Analysis/StudentAnalysis'),
  loading: Loading,
});

const StudentList = Loadable({
  loader: () => import(/* webpackChunkName: 'StudentList' */ '../Components/Analysis/StudentList'),
  loading: Loading,
});

const FourZeroFour = Loadable({
  loader: () => import(/* webpackChunkName: 'FourZeroFour' */ '../Components/ErrorPages/404'),
  loading: Loading,
});

const InvalidURL = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'FourZeroFour' */ '../Components/ErrorPages/InvalidURL'),
  loading: Loading,
});

const ErrorCode = Loadable({
  loader: () => import(/* webpackChunkName: 'ErrorCode' */ '../Components/ErrorPages/ErrorCode'),
  loading: Loading,
});

const Attendance = Loadable({
  loader: () => import(/* webpackChunkName: 'Attendance' */ '../Components/Attendance/Attendance'),
  loading: Loading,
});

const AttendanceBatch = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'Attendancebatch' */ '../Components/Attendance/AttendanceBatch'),
  loading: Loading,
});

const SelectedDateAttendance = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: 'SelectedDate' */ '../Components/Attendance/SelectedDateAttendance'
    ),
  loading: Loading,
});

const DisplayPage = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'DisplayPage' */ '../Components/DisplayPage/DisplayPage'),
  loading: Loading,
});

const DisplayPageEdit = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'DisplayPageEdit' */ '../Components/DisplayPage/DisplayPageEdit'),
  loading: Loading,
});

const DummyDashboard = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'DummyDashPage' */ '../Components/Login/DummyDashboard'),
  loading: Loading,
});

const CRM = Loadable({
  loader: () => import(/* webpackChunkName: 'CRMPage' */ '../Components/CRM/Crm'),
  loading: Loading,
});

const Conversations = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'Conversations' */ '../Components/Conversations/Conversations'),
  loading: Loading,
});

const Conversation = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'Conversation' */ '../Components/Conversations/Conversation'),
  loading: Loading,
});

const ImageEditor = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: 'ImageEditor' */ '../Components/Conversations/ImageEditor/ImageEditor'
    ),
  loading: Loading,
});

const ConversationDetails = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: 'ConversationDetails' */ '../Components/Conversations/ConversationDetails'
    ),
  loading: Loading,
});

const ConversationFiles = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: 'ConversationFiles' */ '../Components/Conversations/ConversationFiles/ConversationFiles'
    ),
  loading: Loading,
});

const ConversationMedia = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: 'ConversationMedia' */ '../Components/Conversations/ConversationMedia/ConversationMedia'
    ),
  loading: Loading,
});

const CreatePost = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'CreatePost' */ '../Components/Conversations/Posts/CreatePost'),
  loading: Loading,
});

const Post = Loadable({
  loader: () => import(/* webpackChunkName: 'Post' */ '../Components/Conversations/Posts/Post'),
  loading: Loading,
});

const viewAllAsignments = Loadable({
  loader: () => import(/* webpackChunkName: 'Post' */ '../Components/Tests/OnlineAssignments'),
  loading: Loading,
});
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

      <Route path='/signin' component={SignIn} />
      <Route path='/signup' component={SignUp} />
      <Route exact path='/login' component={Login} />
      <Route exact path='/preload' component={Preloader} />
      <Route exact path='/login/signup' component={SignupForm} />
      <Route path='/admission' component={AdmissionChat} />
      <Route path='/admissionform' component={AdmissionForm} />
      <Route path='/forgotpassword' component={ForgotPassword} />
      {/* <Route path='/videoplayerplyr/:id' component={VideoPlayer} /> */}
      <Route path='/videoplayer/:id?' component={PlyrVideoPlayer} />

      <AuthenticatedRoute exact path='/allassignments' component={viewAllAsignments} />
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
      <AuthenticatedRoute exact path='/fees/users' component={FeeUserDetails} />
      <AuthenticatedRoute exact path='/fees/students' component={StudentFee} />
      <AuthenticatedRoute exact path='/fees/Feeplans' component={FeePlans} />
      <AuthenticatedRoute exact path='/fees/edit/studentfeeplan' component={EditFeePlan} />
      <AuthenticatedRoute exact path='/order' component={FeesOrder} />
      <AuthenticatedRoute exact path='/ordersummary' component={FeeOrderSummary} />
      <AuthenticatedRoute exact path='/homework' component={HomeWorkCreator} />
      <AuthenticatedRoute exact path='/homework/savedtests' component={SavedSentTests} />
      <AuthenticatedRoute exact path='/homework/savedsent' component={SavedSentTestsUsingFilters} />
      <AuthenticatedRoute exact path='/homework/preview' component={FinalQuestions} />
      <AuthenticatedRoute exact path='/homework/create' component={CreateQuestion} />
      <AuthenticatedRoute exact path='/homework/assign' component={HomeWorkAssigner} />
      <AuthenticatedRoute exact path='/homework/viewonly' component={HomeWorkViewOnly} />
      <AuthenticatedRoute exact path='/courses' component={ViewCourses} />
      <Route exact path='/courses/buyCourse/:clientId?/:courseId?' component={BuyCourse} />
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
      <AuthenticatedRoute exact path='/image-editor' component={ImageEditor} />
      <AuthenticatedRoute exact path='/conversation/details' component={ConversationDetails} />
      <AuthenticatedRoute exact path='/conversations/:id/media' component={ConversationMedia} />
      <AuthenticatedRoute exact path='/conversations/:id/:type' component={ConversationFiles} />
      <AuthenticatedRoute exact path='/create-post' component={CreatePost} />
      <AuthenticatedRoute exact path='/posts/:id' component={Post} />

      <AuthenticatedRoute exact path='/analysis/teacher' component={TeacherAnalysis} />
      <AuthenticatedRoute exact path='/analysis/assignment' component={AssignmentList} />
      <AuthenticatedRoute exact path='/analysis/studentanalysis' component={StudentAnalysis} />
      <AuthenticatedRoute exact path='/analysis/studentlist' component={StudentList} />
      <AuthenticatedRoute exact path='/attendance' component={Attendance} />
      <AuthenticatedRoute exact path='/attendance/batch' component={AttendanceBatch} />
      <AuthenticatedRoute exact path='/attendance/date' component={SelectedDateAttendance} />
      <AuthenticatedRoute exact path='/displaypage' component={DisplayPage} />
      <AuthenticatedRoute exact path='/displaypage/editprofile' component={DisplayPageEdit} />
      <AuthenticatedRoute exact path='/displaypage/preview' component={DummyDashboard} />
      <AuthenticatedRoute exact path='/crm' component={CRM} />
      <AuthenticatedRoute exact path='/videos' component={Videos} />

      <Route path='/fileviewer' component={FileView} />
      <Route path='/otherfileviewer' component={TempViewFile} />

      {/* If error occurs */}

      <Route exact path='/error' component={ErrorCode} />

      {/* redirect user to FourZeroFour page if route does not exist */}

      <Route exact path='/invalidurl' component={InvalidURL} />
      <Route component={FourZeroFour} />
      {/* <Route component={Dashboard} /> */}
    </Switch>
  );
}
