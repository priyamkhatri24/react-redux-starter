import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2';
import { connect } from 'react-redux';
import Timer from './Timer';
import Pallette from './Pallette';
import QuestionCard from './QuestionCard';
import { post } from '../../../Utilities';
import { testsActions } from '../../../redux/actions/tests.action';
import { getClientUserId } from '../../../redux/reducers/clientUserId.reducer';
import {
  getTestId,
  gettestType,
  getTestResultArray,
  getTestStartTime,
  getTestEndTime,
} from '../../../redux/reducers/tests.reducer';
import './QuestionTaker.scss';

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
    };
  }

  componentDidMount() {
    const { testId, testResultArray, testEndTime, testStartTime } = this.props;

    if (testResultArray.length) {
      const idAdd = testResultArray.map((elem) => {
        elem.question_list.map((e, index) => {
          const newObj = e;
          newObj.uuid = index + 1;
          newObj.question_status = 'Not viewed'; // 'Not Viewed' 'Attempted' 'Viewed' Review Answered And Reveiwed
          newObj.option_array.map((res) => (res.isFocus = false));
          newObj.isCorrect = false;
          newObj.timer = 0;
          newObj.noOfTimesVisited = 0;
          return newObj;
        });
        return elem;
      });

      this.setState({
        result: idAdd,
        currentQuestion: testResultArray[0].question_list[0],
        currentSubject: testResultArray[0].subject,
        startingResult: true,
        currentTime: testStartTime,
        testEndTime,
        testId,
      });

      window.addEventListener('beforeunload', this.onUnload);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onUnload);
    this.props.history.push('/');
  }

  onUnload = () => {
    // const {
    //   history,
    //   setTestEndTimeToStore,
    //   setTestIdToStore,
    //   setTestResultArrayToStore,
    //   setTestTypeToStore,
    //   setTestStartTimeToStore,
    // } = this.props;
    this.setState({
      result: [{ question_list: [], subject: '' }],
      currentTime: 0,
      testEndTime: 0,
    });
    // setTestEndTimeToStore(0);
    // setTestIdToStore(null);
    // setTestResultArrayToStore([]);
    // setTestTypeToStore(null);
    // setTestStartTimeToStore(0);
    // history.push('/');
  };

  timerHasFinished = () => {
    console.log('it has finished');
    console.log(this.state.result);
    const finalArray = this.state.result
      .map((elem) => {
        const flattenedQuestionArray = elem.question_list.map((e) => {
          const payload = {};

          payload[e.question_id] = {
            totalTime: e.timer.toString(),
            finalAnswer: e.student_answer === null ? '' : e.student_answer,
            id: e.question_id.toString(),
            totalCount: e.noOfTimesVisited.toString(),
            correctAnswer: e.question_answer.toString(),
            questionType: e.question_type.toString(),
            status: e.question_status.toString(),
            result: (e.isCorrect ? 1 : 0).toString(),
          };

          return payload;
        });
        return flattenedQuestionArray;
      })
      .flat();

    const finalObject = Object.assign({}, ...finalArray);

    console.log(finalObject, 'stiingi');
    const finalPayload = {
      client_user_id: this.props.clientUserId,
      test_id: this.state.testId,
      questions_array: JSON.stringify(finalObject),
    };
    post(finalPayload, '/studentTestActivity').then((res) => {
      if (res.success) {
        const updationPayload = {
          client_user_id: this.props.clientUserId,
          test_id: this.props.testId,
          test_status: 'submitted',
        };
        if (this.props.testType === 'demotest') {
          post(updationPayload, '/updateTestStatus').then((response) => {
            if (response.success) {
              this.testSubmissionAlert();
            }
          });
        } else if (this.props.testType === 'homework' || this.props.testType === 'livetest') {
          post(updationPayload, '/submitTest').then((response) => {
            if (response.success) {
              this.testSubmissionAlert();
            }
          });
        }
      }
    });
  };

  testSubmissionAlert = () => {
    Swal.fire({
      title: 'Well Done!',
      text: 'Test successfully submitted',
      icon: 'success',
      confirmButtonText: `Next`,
      customClass: 'Assignments__SweetAlert',
    }).then((result) => {
      if (result.isConfirmed) {
        this.props.history.push('/');
      }
    });
  };

  triggerFinish = () => {
    console.log('finished');
    this.setState({ modalOpen: true });
  };

  changeQuestion = (subject, questionId) => {
    const currentSubject = this.state.result.filter((elem) => {
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
    if (elem.uuid) {
      const tempResult = [...this.state.result];
      const newResult = tempResult.map((res) => {
        if (res.subject === this.state.currentSubject) {
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

  render() {
    const { currentTime, testEndTime, result, currentQuestion } = this.state;
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
          <div className='ml-auto'>
            <Button variant='finishTest' onClick={() => this.triggerFinish()}>
              Finish
            </Button>
            <MoreVertIcon />
          </div>
        </div>
        <Pallette
          questions={result}
          changeQuestion={this.changeQuestion}
          currentQuestion={currentQuestion}
          startingResult={this.state.startingResult}
        />

        <QuestionCard
          currentQuestion={currentQuestion}
          onUnmount={this.questionCardUnmount}
          onSaveAndNext={this.onSaveAndNext}
        />

        <Modal show={this.state.modalOpen} centered onHide={this.handleFinishClose}>
          <Modal.Body className='text-center'>
            {currentTime !== 0 && testEndTime !== 0 && (
              <>
                <p className='QuestionTaker__timeRemaining mt-3'>Time Remaining</p>
                <Timer
                  startTime={Date.now()}
                  endTime={Date.now() + this.state.timerCurrentTime}
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionTaker);
