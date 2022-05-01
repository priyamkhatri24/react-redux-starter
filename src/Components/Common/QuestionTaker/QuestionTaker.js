import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2';
import { connect } from 'react-redux';
import Timer from './Timer';
import Pallette from './Pallette';
import QuestionCard from './QuestionCard';
import { get, apiValidation, post } from '../../../Utilities';
import { testsActions } from '../../../redux/actions/tests.action';
import { getClientUserId } from '../../../redux/reducers/clientUserId.reducer';
import {
  getTestId,
  gettestType,
  getTestResultArray,
  getTestStartTime,
  getTestEndTime,
  getTestLanguage,
} from '../../../redux/reducers/tests.reducer';
import './QuestionTaker.scss';
import { analysisActions } from '../../../redux/actions/analysis.action';
import { firstTimeLoginActions } from '../../../redux/actions/firsttimeLogin.action';
import { getComeBackFromTests } from '../../../redux/reducers/firstTimeLogin.reducer';
// import ques from './sampleQuestions';

class QuestionTaker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: [
        {
          subject: '',
          question_list: [],
        },
      ],
      currentTime: 0,
      testEndTime: 0,
      testId: 0,
      currentQuestion: '',
      currentSubject: '',
      timerCurrentTime: 0,
      modalOpen: false,
      startingResult: false,
      userWantsToLeave: false,
      userClickedSubmit: false,
      currentLanguage: props.testLanguage === 'hindi' ? 'hindi' : 'english',
    };
  }

  componentDidMount() {
    const {
      testId,
      testResultArray,
      testEndTime,
      testStartTime,
      comeBackFromTests,
      history,
      setComeBackFromTestsToStore,
      clearTests,
    } = this.props;
    const { timerCurrentTime, currentTime, currentQuestionArray, testEndTime: tet } = this.state;

    let idAdd;
    if (comeBackFromTests) {
      Swal.fire({
        title: 'Are you Sure?',
        text: 'You will lose all your progress.',
        icon: 'question',
        showDenyButton: true,
        confirmButtonText: `Yes`,
        denyButtonText: `No`,
        customClass: 'Assignments__SweetAlert',
      }).then((res) => {
        if (res.isConfirmed) {
          this.setState({ userWantsToLeave: true }, () => {
            setComeBackFromTestsToStore(false);
            clearTests();
            history.push('/');
          });
        } else {
          idAdd = testResultArray;
          this.setState({
            result: idAdd,
            currentQuestion: testResultArray[0].question_list[0],
            currentSubject: testResultArray[0].subject,
            startingResult: true,
            currentTime: testStartTime,
            testEndTime,
            testId,
          });
        }
      });
    } else if (testResultArray.length) {
      idAdd = testResultArray.map((elem) => {
        elem.question_list.map((e, index) => {
          const newObj = e;
          newObj.uuid = index + 1;
          newObj.question_status = 'Not viewed'; // 'Not Viewed' 'Attempted' 'Viewed' Review Answered And Reveiwed
          if (!newObj.option_array) {
            newObj.option_array = []; // error boundary
          }
          newObj.option_array.map((res) => (res.isFocus = false));
          if (newObj.hindi_option_array !== undefined)
            newObj.hindi_option_array.map((res) => (res.isFocus = false));
          newObj.isCorrect = false;
          newObj.timer = 0;
          newObj.noOfTimesVisited = 0;
          return newObj;
        });
        return elem;
      });
      if (!currentTime && !tet) {
        this.setState({ currentQuestion: '', currentQuestionArray: [] });
      }
      console.log(currentQuestionArray);
      this.setState({
        result: idAdd,
        currentQuestion: testResultArray[0].question_list[0],
        currentSubject: testResultArray[0].subject,
        startingResult: true,
        currentTime: testStartTime,
        testEndTime,
        testId,
      });
    }
    window.addEventListener('beforeunload', this.onUnload);
  }

  componentWillUnmount() {
    const {
      history,
      setComeBackFromTestsToStore,
      setTestResultArrayToStore,
      setTestEndTimeToStore,
      testStartTime,
    } = this.props;
    const { result, userWantsToLeave, userClickedSubmit, timerCurrentTime } = this.state;
    window.removeEventListener('beforeunload', this.onUnload);
    // clearTests();
    if (!userWantsToLeave) setComeBackFromTestsToStore(true);
    setTestResultArrayToStore(result);
    console.log(timerCurrentTime, 'timeeeeee');

    setTestEndTimeToStore(testStartTime + timerCurrentTime);

    if (!userClickedSubmit) history.push('/');
  }

  onUnload = (e) => {
    // this.submitOnReload();
    const {
      setComeBackFromTestsToStore,
      setTestResultArrayToStore,
      setTestEndTimeToStore,
      testStartTime,
    } = this.props;
    const { result, userWantsToLeave, timerCurrentTime } = this.state;
    window.removeEventListener('beforeunload', this.onUnload);
    // clearTests();
    if (!userWantsToLeave) setComeBackFromTestsToStore(true);
    setTestResultArrayToStore(result);
    console.log(timerCurrentTime, 'timeeeeee');

    setTestEndTimeToStore(testStartTime + timerCurrentTime);

    const message = 'o/';
    (e || window.event).returnValue = message; // Gecko + IE
    return message;
  };

  submitOnReload = () => {
    console.log('starteddddd');
    const { result, testId } = this.state;
    const {
      clientUserId,
      testType,
      testId: testID,
      setTestStartTimeToStore,
      setTestEndTimeToStore,
    } = this.props;
    const finalArray = result
      .map((elem) => {
        const flattenedQuestionArray = elem.question_list.map((e) => {
          const payload = {};

          payload[e.question_id] = {
            totalTime: e.timer * 1000,
            finalAnswer: e.student_answer === null ? '' : e.student_answer,
            id: e.question_id.toString(),
            totalCount: e.noOfTimesVisited.toString(),
            correctAnswer: e.question_answer.toString(),
            questionType: e.question_type.toString(),
            status: e.question_status.toString(),
            result: (e.isCorrect ? 1 : 0).toString(),
            question_positive_marks: e.question_positive_marks,
            question_negative_marks: e.question_negative_marks,
          };

          return payload;
        });
        return flattenedQuestionArray;
      })
      .flat();

    const finalObject = Object.assign({}, ...finalArray);

    const finalPayload = {
      client_user_id: clientUserId,
      test_id: testId,
      questions_array: JSON.stringify(finalObject),
    };

    post(finalPayload, '/studentTestActivityLatest').then((res) => {
      if (res.success) {
        const updationPayload = {
          client_user_id: clientUserId,
          test_id: testID,
          test_status: 'submitted',
        };
        if (testType === 'demotest') {
          post(updationPayload, '/updateTestStatus').then((response) => {
            if (response.success) {
              // this.testSubmissionAlert();
              console.log(response, 'reloaddedddd');
            }
          });
        } else if (testType === 'homework' || testType === 'livetest') {
          post(updationPayload, '/submitTest').then((response) => {
            if (response.success) {
              // this.testSubmissionAlert();
              console.log(response, 'reloadeddd');
            }
          });
        }
      }
    });
    console.log('doneeeee');
    setTestEndTimeToStore(0);
    setTestStartTimeToStore(0);
  };

  timerHasFinished = () => {
    const { result, testId } = this.state;
    const {
      clientUserId,
      testType,
      testId: testID,
      setTestStartTimeToStore,
      setTestEndTimeToStore,
    } = this.props;
    const finalArray = result
      .map((elem) => {
        const flattenedQuestionArray = elem.question_list.map((e) => {
          const payload = {};

          payload[e.question_id] = {
            totalTime: e.timer * 1000,
            finalAnswer: e.student_answer === null ? '' : e.student_answer,
            id: e.question_id.toString(),
            totalCount: e.noOfTimesVisited.toString(),
            correctAnswer: e.question_answer.toString(),
            questionType: e.question_type.toString(),
            status: e.question_status.toString(),
            result: (e.isCorrect ? 1 : 0).toString(),
            question_positive_marks: e.question_positive_marks,
            question_negative_marks: e.question_negative_marks,
          };

          return payload;
        });
        return flattenedQuestionArray;
      })
      .flat();

    const finalObject = Object.assign({}, ...finalArray);

    const finalPayload = {
      client_user_id: clientUserId,
      test_id: testId,
      questions_array: JSON.stringify(finalObject),
    };
    console.log(finalObject, 'finalPayload');

    post(finalPayload, '/studentTestActivityLatest').then((res) => {
      console.log(res, 'firsttt');
      if (res.success) {
        const updationPayload = {
          client_user_id: clientUserId,
          test_id: testID,
          test_status: 'submitted',
        };
        if (testType === 'demotest') {
          post(updationPayload, '/updateTestStatus').then((response) => {
            console.log(response, 'timerFinished');
            if (response.success) {
              this.testSubmissionAlert();
            }
          });
        } else if (testType === 'homework' || testType === 'livetest') {
          post(updationPayload, '/submitTest').then((response) => {
            console.log(response, 'timerFinished');
            if (response.success) {
              this.testSubmissionAlert();
            }
          });
        }
      }
    });

    setTestEndTimeToStore(0);
    setTestStartTimeToStore(0);
  };

  goToStudentAnalysis = () => {
    const {
      clientUserId,
      testId,
      history,
      setAnalysisSubjectArrayToStore,
      setAnalysisTestObjectToStore,
    } = this.props;
    const { currentLanguage } = this.state;
    const payload = {
      test_id: testId,
      client_user_id: clientUserId,
    };
    const subjectAnalysis = get(payload, '/getSubjectAnalysisOfTestForStudentLatest');

    const testAnalysis = get(payload, '/getTestAnalysisForStudentLatest');

    Promise.all([subjectAnalysis, testAnalysis]).then((res) => {
      const subjects = apiValidation(res[0]);
      console.log(res, 'promiseArrayTestAnalysis');
      setAnalysisSubjectArrayToStore(subjects);
      setAnalysisTestObjectToStore({ ...res[1], name: 'Test Analysis' });
      console.log(subjects, 'aaaaaa');
      history.push({
        pathname: '/analysis/studentanalysis',
        state: { language: currentLanguage, name: 'Test Analysis', fromTest: true },
      });
    });
  };

  testSubmissionAlert = () => {
    const { history } = this.props;

    Swal.fire({
      title: 'Well Done!',
      text: 'Test successfully submitted',
      icon: 'success',
      confirmButtonText: `Next`,
      customClass: 'Assignments__SweetAlert',
    }).then((res) => {
      if (res.isConfirmed) {
        this.setState({ userWantsToLeave: true, userClickedSubmit: true });
        this.goToStudentAnalysis();
      }
    });
  };

  triggerFinish = () => {
    console.log('finished');
    this.setState({ modalOpen: true });
  };

  goBackReloaded = () => {
    const { history, setComeBackFromTestsToStore, clearTests } = this.props;
    this.setState({ userWantsToLeave: true }, () => {
      setComeBackFromTestsToStore(false);
      clearTests();
      history.push('/');
    });
  };

  changeQuestion = (subject, questionId) => {
    const { result } = this.state;

    const currentSubject = result.filter((elem) => {
      return elem.subject === subject;
    });

    const tempQuestion = currentSubject[0].question_list;
    const requiredQuestion = tempQuestion.filter((elem) => {
      return elem.uuid === questionId;
    });

    console.log(...requiredQuestion);
    const requiredQuestionObject = requiredQuestion[0];
    this.setState({ currentQuestion: requiredQuestionObject, currentSubject: subject });
  };

  questionCardUnmount = (elem) => {
    console.log(elem, 'njj');
    const { result, currentSubject } = this.state;
    if (elem.uuid) {
      const tempResult = [...result];
      const newResult = tempResult.map((res) => {
        if (res.subject === currentSubject) {
          res.question_list.forEach((e) => {
            if (e.uuid === elem.uuid && e.student_answer === null) {
              e.noOfTimesVisited = elem.count;
              e.question_status = elem.review ? 'Review' : 'Viewed';
            }
          });
        }

        return res;
      });
      this.setState({ result: newResult });
    }
  };

  onSaveAndNext = (elem, saveOrReview = null) => {
    const { currentSubject, result } = this.state;
    console.log(elem, saveOrReview);
    const tempResult = result.filter((e) => {
      // find those that do not have current subject
      return e.subject !== currentSubject;
    });

    const currentQuestionArray = result.filter((e) => {
      // find those that do have current subject - only 1
      return e.subject === currentSubject;
    });

    let currentQuestion;
    // uuid is made by assigning index + 1 to all questions.
    if (elem.uuid !== currentQuestionArray[0].question_list.length) {
      currentQuestion = currentQuestionArray[0].question_list[elem.uuid];
    } else if (elem.uuid === currentQuestionArray[0].question_list.length) {
      currentQuestion = currentQuestionArray[0].question_list[elem.uuid - 1];
    }

    currentQuestionArray[0].question_list.forEach((e) => {
      if (e.uuid === elem.uuid) {
        const newObj = e;
        newObj.isCorrect = elem.isCorrect;
        newObj.student_answer = elem.answer;
        newObj.noOfTimesVisited += 1;
        newObj.question_status =
          elem.answer === null && saveOrReview === 'Save And Next'
            ? 'Viewed'
            : elem.answer !== null && saveOrReview === 'Save And Next'
            ? 'Attempted'
            : elem.answer === null && saveOrReview === 'Mark For Review'
            ? 'Review'
            : 'Answered And review';
        newObj.timer += elem.time;
        return newObj;
      }
      return e;
    });

    const temperoryResult = [currentQuestionArray, ...tempResult].flat();
    //  .sort((a, b) => a.subject.localeCompare(b.subject)); // sorts the array alphabetically according to subject

    console.log(currentQuestionArray);

    console.log(temperoryResult);

    this.setState({ result: temperoryResult, currentQuestion });

    //  const tempQuestion = currentSubject[0].question_list;
    //  const requiredQuestion = tempQuestion.filter((elem) => {
    //    return elem.uuid === questionId;
    //  });
  };

  getCurrentTimerTime = (time) => {
    this.setState({ timerCurrentTime: time });
  };

  handleFinishClose = () => this.setState({ modalOpen: false });

  changeLanguage = (language) => {
    this.setState({ currentLanguage: language });
  };

  render() {
    const {
      currentTime,
      testEndTime,
      result,
      currentQuestion,
      startingResult,
      modalOpen,
      timerCurrentTime,
      currentLanguage,
    } = this.state;

    const { testLanguage, testType } = this.props;
    console.log(testLanguage, 'haha');

    return (
      <div className='QuestionTaker'>
        <div className='mx-2 mt-3 d-flex'>
          {currentTime !== 0 && testEndTime !== 0 && (
            <Timer
              startTime={currentTime}
              endTime={testEndTime}
              isFinished={this.timerHasFinished}
              getCurrentTimerTime={this.getCurrentTimerTime}
            />
          )}
          {testLanguage === 'both' && (
            <Button
              variant='boldText'
              className='ml-3'
              onClick={() =>
                this.changeLanguage(currentLanguage === 'english' ? 'hindi' : 'english')
              } //eslint-disable-line
            >
              Change to{' '}
              <span style={{ textTransform: 'capitalize' }}>
                {currentLanguage === 'english' ? 'hindi' : 'english'}
              </span>
            </Button>
          )}
          <div className='ml-auto'>
            <Button variant='finishTest' onClick={() => this.triggerFinish()}>
              Finish
            </Button>
            <MoreVertIcon />
          </div>
        </div>
        {(currentTime !== 0 && testEndTime !== 0) || testType === 'homework' ? (
          <>
            {' '}
            <Pallette
              questions={result}
              changeQuestion={this.changeQuestion}
              currentQuestion={currentQuestion}
              startingResult={startingResult}
            />
            <QuestionCard
              currentQuestion={currentQuestion}
              // currentQuestion={ques[0]}
              onUnmount={this.questionCardUnmount}
              onSaveAndNext={this.onSaveAndNext}
              language={currentLanguage}
            />
          </>
        ) : (
          <div className='testHasBeenSubContainer'>
            <h2 className='testHasBeenSubmitted'>Your test has been submitted. Good luck!</h2>
            <p>
              <Button variant='customPrimary' onClick={this.goBackReloaded}>
                Go back
              </Button>
            </p>
          </div>
        )}

        <Modal show={modalOpen} centered onHide={this.handleFinishClose}>
          <Modal.Body className='text-center'>
            {currentTime !== 0 && testEndTime !== 0 && (
              <>
                <p className='QuestionTaker__timeRemaining mt-3'>Time Remaining</p>
                <Timer
                  startTime={Date.now()}
                  endTime={Date.now() + timerCurrentTime}
                  isFinished={this.timerHasFinished}
                />
              </>
            )}
            <p style={{ marginTop: '6rem' }}>
              <Button variant='dashboardBlueOnWhite' onClick={this.handleFinishClose}>
                Resume
              </Button>
            </p>
            <p>
              <Button variant='customPrimary' onClick={this.timerHasFinished}>
                Submit
              </Button>
            </p>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  clientUserId: getClientUserId(state),
  testId: getTestId(state),
  testType: gettestType(state),
  testResultArray: getTestResultArray(state),
  testStartTime: getTestStartTime(state),
  testEndTime: getTestEndTime(state),
  comeBackFromTests: getComeBackFromTests(state),
  testLanguage: getTestLanguage(state),
});

const mapDispatchToProps = (dispatch) => {
  return {
    setTestIdToStore: (payload) => {
      dispatch(testsActions.setTestIdToStore(payload));
    },
    setTestTypeToStore: (payload) => {
      dispatch(testsActions.setTestTypeToStore(payload));
    },
    setTestStartTimeToStore: (payload) => {
      dispatch(testsActions.setTestStartTimeToStore(payload));
    },
    setTestEndTimeToStore: (payload) => {
      dispatch(testsActions.setTestEndTimeToStore(payload));
    },
    setTestResultArrayToStore: (payload) => {
      dispatch(testsActions.setTestResultArrayToStore(payload));
    },
    clearTests: () => {
      dispatch(testsActions.clearTests());
    },
    setComeBackFromTestsToStore: (payload) => {
      dispatch(firstTimeLoginActions.setComeBackFromTestsToStore(payload));
    },
    setAnalysisTestObjectToStore: (payload) => {
      dispatch(analysisActions.setAnalysisTestObjectToStore(payload));
    },
    setAnalysisSubjectArrayToStore: (payload) => {
      dispatch(analysisActions.setAnalysisSubjectArrayToStore(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionTaker);

QuestionTaker.propTypes = {
  clientUserId: PropTypes.number.isRequired,
  testId: PropTypes.number.isRequired,
  testType: PropTypes.string.isRequired,
  testLanguage: PropTypes.string.isRequired,
  testResultArray: PropTypes.instanceOf(Array).isRequired,
  testStartTime: PropTypes.number.isRequired,
  testEndTime: PropTypes.number.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  }).isRequired,
  setTestEndTimeToStore: PropTypes.func.isRequired,
  setTestStartTimeToStore: PropTypes.func.isRequired,
  setComeBackFromTestsToStore: PropTypes.func.isRequired,
  setTestResultArrayToStore: PropTypes.func.isRequired,
  comeBackFromTests: PropTypes.bool.isRequired,
  clearTests: PropTypes.func.isRequired,
  setAnalysisTestObjectToStore: PropTypes.func.isRequired,
  setAnalysisSubjectArrayToStore: PropTypes.func.isRequired,
};
