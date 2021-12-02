import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DatePicker from 'react-datepicker';
import DurationPicker from 'react-duration-picker';
import 'react-datepicker/dist/react-datepicker.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import getUnixTime from 'date-fns/getUnixTime';
import addSeconds from 'date-fns/addSeconds';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { BatchesSelector, PageHeader } from '../Common';
import CustomDurationPicker from '../Common/DurationPicker/CustomDurationPicker';
import {
  getCurrentChapterArray,
  getHomeworkLanguageType,
  getSelectedQuestionArray,
  getTestClassSubject,
  getCurrentSubjectArray,
  getTestId,
  getTestIsDraft,
  getTestName,
} from '../../redux/reducers/homeworkCreator.reducer';
import {
  getClientId,
  getClientUserId,
  getRoleArray,
} from '../../redux/reducers/clientUserId.reducer';
import { get, apiValidation, post } from '../../Utilities';
import '../Live Classes/LiveClasses.scss';
import './HomeWorkCreator.scss';
import { getUserProfile } from '../../redux/reducers/userProfile.reducer';
import { courseActions } from '../../redux/actions/course.action';
import { homeworkActions } from '../../redux/actions/homework.action';

const CustomInput = ({ value, onClick }) => (
  <Row className='m-2 justify-content-center'>
    <label htmlFor='Select Date' className='has-float-label my-auto w-100'>
      <input
        className='form-control'
        name='Select Date'
        type='text'
        placeholder='Select Date'
        onClick={onClick}
        readOnly
        value={value}
      />
      <span>Select Date</span>
      <i className='LiveClasses__show'>
        <ExpandMoreIcon />
      </i>
    </label>
  </Row>
);

const HomeWorkAssigner = (props) => {
  const {
    testName,
    clientId,
    clientUserId,
    roleArray,
    testId,
    testIsDraft,
    setHomeworkLanguageTypeToStore,
    testClassSubject,
    currentChapterArray,
    userProfile,
    homeworkLanguageType,
    selectedQuestionArray,
    setCourseAddContentTestIdToStore,
    history,
    history: {
      location: {
        state: { draft, onlyNext, testIdd, courseId, sectionId },
      },
    },
  } = props;
  const [currentTestName, setTestName] = useState('');
  const [batches, setBatches] = useState([]);
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [batchInputValue, setBatchInputValue] = useState('');
  const [duration, setDuration] = useState({ hours: 1, minutes: 0, seconds: 0 });
  const [DurationModalOpen, setDurationModal] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [currentAssignentType, setCurrentAssignmentType] = useState('');
  const [durationValue, setDurationValue] = useState('');
  const [startTime, setStartTime] = useState('');
  const [assignmentType, setAssignmentType] = useState([
    { id: 1, text: 'Homework', isSelected: true, value: 'homework' },
    { id: 2, text: 'Live Test', isSelected: false, value: 'live test' },
    { id: 3, text: 'Demo Test', isSelected: false, value: 'demo test' },
  ]);
  const [postTo, setPostTo] = useState([
    { id: 1, text: 'In App', isSelected: true },
    { id: 2, text: 'Welcome', isSelected: false },
  ]);

  const [showAnalysis, setShowAnalysis] = useState([
    { id: 1, text: 'No', isSelected: true },
    { id: 2, text: 'Yes', isSelected: false },
  ]);

  const [analysisDate, setAnalysisDate] = useState(new Date());
  const [analysisStartTime, setAnalysisStartTime] = useState('');

  useEffect(() => {
    if (onlyNext) {
      setAssignmentType([
        { id: 1, text: 'Homework', isSelected: true, value: 'homework' },
        { id: 3, text: 'Demo Test', isSelected: false, value: 'demo test' },
      ]);
    }
  }, [onlyNext]);

  useEffect(() => {
    setTestName(testName);
    if (roleArray.includes(4)) {
      get({ client_id: clientId }, '/getAllBatchesOfCoaching').then((res) => {
        const result = apiValidation(res);
        setBatches(result);
      });
    } else {
      get({ client_user_id: clientUserId }, '/getBatchesOfTeacher').then((res) => {
        const result = apiValidation(res);
        setBatches(result);
      });
    }
  }, [testName, clientId, roleArray, clientUserId]);

  const handleClose = () => setShowModal(false);

  const getSelectedBatches = (payload) => {
    // const { selectedBatches } = this.state;
    setSelectedBatches(payload);
    const extraBatchesString = payload.length > 1 ? ` +${(payload.length - 2).toString()}` : '';
    if (payload.length) {
      const inputString = payload.reduce((acc, elem, index) => {
        if (index < 1) {
          return `${acc + elem.batch_name},`;
        }
        if (index === 1) {
          return acc + elem.batch_name;
        }
        return acc;
      }, '');
      if (selectedBatches.length > 0) setBatchInputValue(inputString + extraBatchesString);
      else setBatchInputValue('');
    }
  };

  const selectType = (elem) => {
    const newSubjectAraay = assignmentType.map((e) => {
      e.isSelected = false;
      if (e.id === elem) e.isSelected = !e.isSelected;
      return e;
    });
    const currentType = newSubjectAraay.filter((e) => e.isSelected === true)[0].text;
    setAssignmentType(newSubjectAraay);
    setCurrentAssignmentType(currentType);
  };

  const selectPostTo = (elem) => {
    const newSubjectAraay = postTo.map((e) => {
      e.isSelected = false;
      if (e.id === elem) e.isSelected = !e.isSelected;
      return e;
    });
    setPostTo(newSubjectAraay);
  };

  const selectAnalysis = (elem) => {
    const newSubjectAraay = showAnalysis.map((e) => {
      e.isSelected = false;
      if (e.id === elem) e.isSelected = !e.isSelected;
      return e;
    });
    setShowAnalysis(newSubjectAraay);
  };

  const closeDurationModal = () => {
    setDurationModal(false);
    console.log(duration);
    const durationString = `${duration.hours < 10 ? `0${duration.hours}` : duration.hours}:${
      duration.minutes < 10 ? `0${duration.minutes}` : duration.minutes
    }:${duration.seconds < 10 ? `0${duration.seconds}` : duration.seconds}`;
    setDurationValue(durationString);
  };

  const assignTestFinally = () => {
    const testType = assignmentType.filter((e) => e.isSelected === true)[0].value;
    const testDuration = (duration.hours * 3600 + duration.minutes * 60 + duration.seconds) * 1000;
    const startDateMidnight = new Date(startDate.toDateString());
    const startTimeInSeconds = startTime.split(':').reduce((acc, curr) => {
      return acc * 60 + parseInt(curr, 10);
    }, 0);
    const startTimeDate = addSeconds(startDateMidnight, startTimeInSeconds);
    let answerKey = null;

    if (testType === 'live test' && showAnalysis[1].isSelected) {
      const analysisTimeInSeconds = analysisStartTime.split(':').reduce((acc, curr) => {
        return acc * 60 + parseInt(curr, 10);
      }, 0);
      const analysisDateMidnight = new Date(analysisDate.toDateString());
      answerKey = addSeconds(analysisDateMidnight, analysisTimeInSeconds);
    }

    /** *************Logic for notfications*************** */

    const topicArray = selectedBatches.map((e) => {
      return process.env.NODE_ENV === 'development'
        ? `developmentbatch${e.client_batch_id}.0`
        : `productionbatch${e.client_batch_id}.0`;
    });

    const message = `${currentAssignentType} has been assigned to ${selectedBatches.reduce(
      (acc, curr, i) => {
        return i === selectedBatches.length - 1
          ? `${acc + curr.batch_name} `
          : `${acc + curr.batch_name}, `;
      },
      '',
    )}`;

    /** ************************************************* */
    const payload = {
      is_public: postTo.filter((e) => e.isSelected === true)[0].id !== 1,
      test_id: testId,
      test_name: currentTestName,
      test_date: getUnixTime(startDate),
      test_type: testType,
      language_type: homeworkLanguageType,
      is_draft: testIsDraft,
      teacher_id: clientUserId,
      client_id: clientId,
      name: `${userProfile.firstName} ${userProfile.lastName}`,
      batch_array: JSON.stringify(selectedBatches.map((e) => e.client_batch_id)),
      questions_array: JSON.stringify(selectedQuestionArray.map((e) => e.question_id)),
      class_subject: JSON.stringify(testClassSubject), // class_subject_array
      chapter_array: JSON.stringify(currentChapterArray),
      test_duration: testType === 'homework' ? null : testDuration,
      start_time: testType !== 'live test' ? null : getUnixTime(startTimeDate),
      answer_key: answerKey,
    };
    console.log(testClassSubject);
    console.log(payload, 'kakakakskdasd');

    post(payload, '/addTest').then((res) => {
      console.log(res);
      if (res.success) {
        setHomeworkLanguageTypeToStore('');
        const messagePayload = {
          message,
          title: currentAssignentType,
          type: 'batch_notification',
          batch_array: JSON.stringify(selectedBatches.map((e) => e.client_batch_id)),
          topic_array: JSON.stringify(topicArray),
          client_id: clientId,
          client_user_id: clientUserId,
        };
        if (postTo.filter((e) => e.isSelected === true)[0].id === 1) {
          post(messagePayload, '/sendNotification').then((resp) => {
            if (resp.success === 1) {
              Swal.fire({
                title: 'Success',
                text: 'Assignment assigned Successfully!',
                icon: 'success',
                confirmButtonText: `Done`,
                customClass: 'Assignments__SweetAlert',
              }).then((result) => {
                if (result.isConfirmed) {
                  history.push({ pathname: '/homework/savedsent', state: 'sent' });
                }
              });
            }
          });
        } else {
          Swal.fire({
            title: 'Success',
            text: 'Assignment assigned Successfully!',
            icon: 'success',
            confirmButtonText: `Done`,
            customClass: 'Assignments__SweetAlert',
          }).then((result) => {
            if (result.isConfirmed) {
              history.push({ pathname: '/homework/savedsent', state: { testType: 'sent' } });
            }
          });
        }
      }
    });

    console.log(payload);
  };
  const assignTestToCourse = () => {
    const testType = assignmentType.filter((e) => e.isSelected === true)[0].value;
    const testDuration = (duration.hours * 3600 + duration.minutes * 60 + duration.seconds) * 1000;
    const startDateMidnight = new Date(startDate.toDateString());
    const startTimeInSeconds = startTime.split(':').reduce((acc, curr) => {
      return acc * 60 + parseInt(curr, 10);
    }, 0);
    const startTimeDate = addSeconds(startDateMidnight, startTimeInSeconds);
    const answerKey = null;

    /** ************************************************* */
    const payload = {
      is_public: postTo.filter((e) => e.isSelected === true)[0].id !== 1,
      test_id: testIdd,
      test_name: currentTestName,
      test_date: getUnixTime(startDate),
      test_type: testType,
      language_type: homeworkLanguageType,
      is_draft: testIsDraft,
      teacher_id: clientUserId,
      client_id: clientId,
      name: `${userProfile.firstName} ${userProfile.lastName}`,
      batch_array: JSON.stringify(selectedBatches.map((e) => e.client_batch_id)),
      questions_array: JSON.stringify(selectedQuestionArray.map((e) => e.question_id)),
      class_subject: JSON.stringify(testClassSubject), // class_subject_array
      chapter_array: JSON.stringify(currentChapterArray),
      test_duration: testType === 'homework' ? null : testDuration,
      start_time: testType !== 'live test' ? null : getUnixTime(startTimeDate),
      answer_key: answerKey,
      course_id: courseId,
      section_id: sectionId,
    };
    console.log(testClassSubject);
    console.log(payload, 'kakakakskdasd');

    post(payload, '/addTestToCourse').then((res) => {
      console.log(res);
      history.push({ pathname: '/courses/createcourse/addcontent', state: { draft } });
      setCourseAddContentTestIdToStore(testIdd);
      setHomeworkLanguageTypeToStore('');
    });
  };

  const addTestToCourse = () => {
    history.push({ pathname: '/courses/createcourse/addcontent', state: { draft } });
    setCourseAddContentTestIdToStore(testIdd);
  };

  return (
    <div style={{ height: '90vh' }}>
      <PageHeader title='Assign Test' />
      <Card style={{ marginTop: '5rem', padding: '1rem' }} className='mx-2 Homework__selectCard'>
        <Row className='m-2'>
          <label htmlFor='Test Name' className='has-float-label my-auto w-100'>
            <input
              className='form-control'
              name='Test Name'
              type='text'
              placeholder='Test Name'
              onChange={(e) => setTestName(e.target.value)}
              value={currentTestName}
            />
            <span>Test Name</span>
          </label>
        </Row>
        {!onlyNext ? (
          <Row className='m-2'>
            <label htmlFor='Select Batch' className='w-100 has-float-label my-auto'>
              <input
                className='form-control'
                name='Select Batch'
                type='text'
                placeholder='Select Batch'
                onClick={() => setShowModal(true)}
                readOnly
                value={batchInputValue}
              />
              <span>Select Batch</span>
              <i className='LiveClasses__show'>
                <ExpandMoreIcon />
              </i>
            </label>
          </Row>
        ) : null}
        {!onlyNext ? (
          <Row className='m-0 justify-content-center'>
            <DatePicker
              selected={startDate}
              dateFormat='dd/MM/yyyy'
              onChange={(date) => setStartDate(date)}
              customInput={<CustomInput />}
            />
          </Row>
        ) : null}
        <Row className='mx-2'>
          <small className='text-left Homework__smallHeading mx-3 my-2'>Assignment Type</small>
          <section className='Homework__scrollable'>
            {assignmentType.map((e) => {
              return (
                <div
                  key={e.id}
                  className={
                    e.isSelected
                      ? 'Homework__subjectBubble Homework__selected'
                      : 'Homework__subjectBubble Homework__unselected'
                  }
                  onClick={() => selectType(e.id)}
                  onKeyDown={() => selectType(e.id)}
                  role='button'
                  tabIndex='-1'
                >
                  {e.text}
                </div>
              );
            })}
          </section>
        </Row>
        {currentAssignentType === 'Live Test' && (
          <>
            <Row className='justify-content-center mt-3'>
              <Col xs={5} className='m-auto p-0'>
                <label htmlFor='Select Duration' className='w-100 has-float-label my-auto'>
                  <input
                    className='form-control'
                    name='Select Duration'
                    type='text'
                    placeholder='Select Duration'
                    onClick={() => setDurationModal(true)}
                    readOnly
                    value={durationValue}
                  />
                  <span>Select Duration</span>
                  <i className='LiveClasses__show'>
                    <ExpandMoreIcon />
                  </i>
                </label>
              </Col>
              <Col xs={5} className='m-auto p-0'>
                <label className='has-float-label my-auto w-100'>
                  <input
                    className='form-control'
                    name='Start Time'
                    type='time'
                    step='1'
                    placeholder='Start Time'
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                  <span>Start Time</span>
                </label>
              </Col>
            </Row>
            <small className='text-left Homework__smallHeading mx-3 mb-2 mt-4'>
              Do you wish to add Analysis
            </small>

            <Row className='mx-2'>
              {showAnalysis.map((e) => {
                return (
                  <div
                    key={e.id}
                    className={
                      e.isSelected
                        ? 'Homework__subjectBubble Homework__selected'
                        : 'Homework__subjectBubble Homework__unselected'
                    }
                    onClick={() => selectAnalysis(e.id)}
                    onKeyDown={() => selectAnalysis(e.id)}
                    role='button'
                    tabIndex='-1'
                  >
                    {e.text}
                  </div>
                );
              })}
            </Row>
            {showAnalysis.filter((e) => e.isSelected === true)[0].id === 2 && (
              <Row className='justify-content-center mt-3'>
                <Col xs={5} className='m-auto p-0'>
                  <DatePicker
                    minDate={startDate}
                    selected={analysisDate}
                    dateFormat='dd/MM/yyyy'
                    onChange={(date) => setAnalysisDate(date)}
                    customInput={<CustomInput />}
                  />
                </Col>
                <Col xs={5} className='m-auto p-0'>
                  <label className='has-float-label my-auto w-100'>
                    <input
                      className='form-control'
                      name='Analysis Time'
                      type='time'
                      step='1'
                      placeholder='Analysis Time'
                      value={analysisStartTime}
                      onChange={(e) => setAnalysisStartTime(e.target.value)}
                    />
                    <span>Analysis Time</span>
                  </label>
                </Col>
              </Row>
            )}
          </>
        )}

        {currentAssignentType === 'Demo Test' && (
          <Row className='justify-content-center mt-3'>
            <Col xs={10} className='m-auto p-0'>
              <label htmlFor='Select Duration' className='w-100 has-float-label my-auto'>
                <input
                  className='form-control'
                  name='Select Duration'
                  type='text'
                  placeholder='Select Duration'
                  onClick={() => setDurationModal(true)}
                  readOnly
                  value={durationValue}
                />
                <span>Select Duration</span>
                <i className='LiveClasses__show'>
                  <ExpandMoreIcon />
                </i>
              </label>
            </Col>
          </Row>
        )}
        {!onlyNext ? (
          <Row className='mx-2'>
            <small className='text-left Homework__smallHeading mx-3 mb-2 mt-4'>
              Where Do You want to post this assignment
            </small>

            {postTo.map((e) => {
              return (
                <div
                  key={e.id}
                  className={
                    e.isSelected
                      ? 'Homework__subjectBubble Homework__selected'
                      : 'Homework__subjectBubble Homework__unselected'
                  }
                  onClick={() => selectPostTo(e.id)}
                  onKeyDown={() => selectPostTo(e.id)}
                  role='button'
                  tabIndex='-1'
                >
                  {e.text}
                </div>
              );
            })}
          </Row>
        ) : null}
      </Card>
      <Row className='justify-content-center mt-4'>
        <Button
          variant='customPrimary'
          onClick={() => (onlyNext ? assignTestToCourse() : assignTestFinally())}
        >
          {onlyNext ? 'Add' : 'Send'}
        </Button>
      </Row>
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Batches</Modal.Title>
        </Modal.Header>
        <BatchesSelector
          batches={batches}
          selectBatches={selectedBatches}
          getSelectedBatches={getSelectedBatches}
          title='Batches'
        />
        <Modal.Footer>
          <Button variant='dashboardBlueOnWhite' onClick={handleClose}>
            Next
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={DurationModalOpen} onHide={closeDurationModal} centered>
        {/* <DurationPicker
          onChange={(durartion) => setDuration(durartion)}
          // onChange={(durartion) => console.log(durartion)}
          initialDuration={{ hours: 1, minutes: 2, seconds: 3 }}
        /> */}
        <CustomDurationPicker changed={(durartion) => setDuration(durartion)} />
        <Modal.Footer>
          <Button variant='dashboardBlueOnWhite' onClick={closeDurationModal}>
            Next
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => ({
  testName: getTestName(state),
  clientId: getClientId(state),
  clientUserId: getClientUserId(state),
  roleArray: getRoleArray(state),
  testId: getTestId(state),
  testIsDraft: getTestIsDraft(state),
  testClassSubject: getCurrentSubjectArray(state),
  currentChapterArray: getCurrentChapterArray(state),
  userProfile: getUserProfile(state),
  selectedQuestionArray: getSelectedQuestionArray(state),
  homeworkLanguageType: getHomeworkLanguageType(state),
});
const mapDispatchToProps = (dispatch) => {
  return {
    setCourseAddContentTestIdToStore: (payload) => {
      dispatch(courseActions.setCourseAddContentTestIdToStore(payload));
    },
    setHomeworkLanguageTypeToStore: (payload) => {
      dispatch(homeworkActions.setHomeworkLanguageTypeToStore(payload));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(HomeWorkAssigner);

HomeWorkAssigner.propTypes = {
  testName: PropTypes.string.isRequired,
  clientId: PropTypes.number.isRequired,
  clientUserId: PropTypes.number.isRequired,
  roleArray: PropTypes.instanceOf(Array).isRequired,
  testId: PropTypes.number.isRequired,
  testIsDraft: PropTypes.number.isRequired,
  testClassSubject: PropTypes.instanceOf(Object).isRequired,
  currentChapterArray: PropTypes.instanceOf(Array).isRequired,
  userProfile: PropTypes.instanceOf(Object).isRequired,
  selectedQuestionArray: PropTypes.instanceOf(Array).isRequired,
  homeworkLanguageType: PropTypes.string.isRequired,
  setHomeworkLanguageTypeToStore: PropTypes.func.isRequired,
  setCourseAddContentTestIdToStore: PropTypes.func.isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
    location: PropTypes.shape({
      state: PropTypes.shape({
        onlyNext: PropTypes.bool,
        draft: PropTypes.bool,
        testIdd: PropTypes.number,
        courseId: PropTypes.number,
        sectionId: PropTypes.number,
      }),
    }),
  }).isRequired,
};

CustomInput.propTypes = {
  value: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
};
