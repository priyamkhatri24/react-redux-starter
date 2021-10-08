import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tabs from 'react-bootstrap/Tabs';
import Spinner from 'react-bootstrap/Spinner';
import Tab from 'react-bootstrap/Tab';
import fromUnixTime from 'date-fns/fromUnixTime';
import format from 'date-fns/format';
import { connect } from 'react-redux';
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';
import { PageHeader } from '../Common';
import { get, apiValidation } from '../../Utilities';
import { Loader } from '../Common/Loader/Loading';
import {
  getClientId,
  getClientUserId,
  getRoleArray,
} from '../../redux/reducers/clientUserId.reducer';
import {
  getSelectedQuestionArray,
  getCurrentChapterArray,
  getCurrentSubjectArray,
  getTestId,
  getTestName,
  getHomeworkLanguageType,
} from '../../redux/reducers/homeworkCreator.reducer';
import { homeworkActions } from '../../redux/actions/homework.action';
import { courseActions } from '../../redux/actions/course.action';

const SavedSentTests = (props) => {
  const {
    clientUserId,
    clientId,
    roleArray,
    history: { location: { state: { courseId, sectionId, classId, goTo = null } } = {} } = {},
    setCurrentSlide,
    setQuestionArrayToStore,
    setCourseAddContentTestIdToStore,
    setTestIsDraftToStore,
    selectedQuestionArray,
    setTestIdToStore,
    setSelectedQuestionArrayToStore,
    setCurrentSubjectArrayToStore,
    setCurrentChapterArrayToStore,
    setTestNameToStore,
    currentSubjectArray,
    currentChapterArray,
    testIdOld,
    language,
    setHomeworkLanguageTypeToStore,
    testNameOld,
    history,
    clearTests,
  } = props;
  const [sentTests, setSentTests] = useState([]);
  const [savedTests, setSavedTests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log(roleArray, 'roleeeearrraayyyy');
    const homeworkPayload = {
      client_user_id: clientUserId,
      is_admin: roleArray.includes(4) ? 'true' : 'false',
      client_id: clientId,
      class_id: goTo === 'addContent' ? null : classId.class_id,
      language,
    };

    const sentAssignmentPayload = {
      client_user_id: clientUserId,
      class_id: goTo === 'addContent' ? null : classId.class_id,
      client_batch_id: null,
      is_admin: roleArray.includes(4) ? 'true' : 'false',
      client_id: clientId,
      assignent_type: null,
      language,
    };
    console.log(sentAssignmentPayload);
    console.log(homeworkPayload);

    get(homeworkPayload, '/getSavedHomeworksUsingLanguage').then((res) => {
      const result = apiValidation(res);
      console.log(result, 'savdedAssignmentsListtttttttt');

      setSavedTests(result);
    });

    get(sentAssignmentPayload, '/getSentAssignmentsUsingLanguage').then((res) => {
      const result = apiValidation(res);
      console.log(result, 'sentAssignmentsListtttttttt');
      setSentTests(result);
    });
  }, [clientUserId, clientId, classId, roleArray, goTo]);

  const getQuestions = (testId, test) => {
    setIsLoading(true);
    get({ test_id: testId }, '/getTestQuestions').then((res) => {
      console.log(res, 'responseFromSavedTestssss');
      const result = apiValidation(res);
      clearTests();
      console.log(test, 'hahahahhah');
      if (selectedQuestionArray.length) {
        setCurrentSlide(1);
        // setTestIdToStore(testId);
        const newQuestionArray = [...result, ...selectedQuestionArray];
        setTestIdToStore(testIdOld);
        setTestNameToStore(testNameOld);
        setCurrentSubjectArrayToStore(currentSubjectArray);
        setCurrentChapterArrayToStore(currentChapterArray);
        setQuestionArrayToStore(newQuestionArray);
        setHomeworkLanguageTypeToStore(test.language_type);
        setSelectedQuestionArrayToStore(selectedQuestionArray);
        setIsLoading(false);
        history.push('/homework');
        return;
      }
      result.forEach((elem) => {
        elem.directFromSaved = true;
        elem.isSelected = true;
      });
      console.log(result, 'resultttttttttt');
      setCurrentSlide(2);
      history.push('/homework');
      setTestIdToStore(testId);
      setTestNameToStore(test.test_name);
      setHomeworkLanguageTypeToStore(test.language_type);
      setCurrentSubjectArrayToStore(res.class_subject.class_subject_array);
      setCurrentChapterArrayToStore(res.chapter_array);
      setSelectedQuestionArrayToStore(result);
      setQuestionArrayToStore(result);
      setIsLoading(false);
    });
  };
  const getQuestionsSent = (testId, test) => {
    setIsLoading(true);
    get({ test_id: testId }, '/getTestQuestions').then((res) => {
      console.log(res);
      const result = apiValidation(res);
      clearTests();
      if (selectedQuestionArray.length) {
        console.log(testIdOld, testNameOld, 'hahahahhah');
        setCurrentSlide(1);
        // setTestIdToStore(testId);
        const newQuestionArray = [...result, ...selectedQuestionArray];
        setTestIdToStore(testIdOld);
        setTestNameToStore(testNameOld);
        setHomeworkLanguageTypeToStore(test.language_type);
        setCurrentSubjectArrayToStore(currentSubjectArray);
        setCurrentChapterArrayToStore(currentChapterArray);
        setQuestionArrayToStore(newQuestionArray);
        setSelectedQuestionArrayToStore(selectedQuestionArray);
        setIsLoading(false);
        history.push('/homework');
        return;
      }
      // result.forEach((elem) => {
      //   elem.directFromSaved = true;
      //   elem.isSelected = true;
      // });
      console.log(result, 'resultttttttttt');
      setCurrentSubjectArrayToStore(res.class_subject.class_subject_array);
      setHomeworkLanguageTypeToStore(test.language_type);
      setCurrentChapterArrayToStore(res.chapter_array);
      setCurrentSlide(1);
      // setTestIdToStore(testId);
      setQuestionArrayToStore(result);
      setIsLoading(false);
      history.push('/homework');
    });
  };

  const goToAddContent = (test, draft, testsType) => {
    if (testsType === 'sent') {
      setTestIsDraftToStore(0);
    } else if (testsType === 'saved') {
      setTestIsDraftToStore(1);
    }
    console.log(test);
    setHomeworkLanguageTypeToStore(test.language_type);
    history.push({
      pathname: '/homework/viewonly',
      state: { draft, onlyNext: true, testIdd: test.test_id, courseId, sectionId, testsType },
    });
    // setCourseAddContentTestIdToStore(testId);
  };

  return (
    <div className='Assignments'>
      {isLoading ? (
        <div
          className='d-flex  justify-content-center align-items-center'
          style={{
            height: '100%',
            width: '100%',
            position: 'fixed',
            top: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(255,255,255,0.8)',
            overflow: 'hidden',
            pointerEvents: 'none',
          }}
        >
          <Spinner animation='border' role='status'>
            <span className='sr-only'>Loading...</span>
          </Spinner>{' '}
        </div>
      ) : null}
      <PageHeader title='Tests' />
      <div style={{ marginTop: '5rem' }}>
        <Tabs defaultActiveKey='Sent Tests' className='Profile__Tabs' justify>
          <Tab eventKey='Sent Tests' title='Sent Tests'>
            {sentTests.map((elem, i) => {
              return (
                <Row
                  className='LiveClasses__adminCard p-2 m-3'
                  key={`elem${elem.test_id * Math.random() * i}`}
                  onClick={
                    goTo === 'addContent'
                      ? () => goToAddContent(elem, false, 'sent')
                      : () => getQuestionsSent(elem.test_id, elem)
                  }
                >
                  <Col xs={2}>
                    <AssignmentOutlinedIcon />
                  </Col>
                  <Col xs={10} className='p-0'>
                    <h6 className='LiveClasses__adminHeading mb-0'>{elem.test_name}</h6>
                    <p className='LiveClasses__adminCardTime mb-0' style={{ fontSize: '10px' }}>
                      Created: {format(fromUnixTime(elem.created_at), 'HH:mm MMM dd, yyyy')}
                    </p>
                    <p className='Homework__dueDate mb-0'>
                      Sent By: {elem.first_name} {elem.last_name}
                    </p>
                    <p className='Homework__dueDate mb-0'>
                      To:{' '}
                      {elem.batch_array.map((e) => (
                        <span>{e},</span>
                      ))}
                    </p>
                  </Col>
                </Row>
              );
            })}
          </Tab>
          <Tab eventKey='Saved Tests' title='Saved Tests'>
            {savedTests.map((elem, i) => {
              return (
                <Row
                  className='LiveClasses__adminCard p-2 m-3'
                  key={`elem${elem.test_id * Math.random() * i}`}
                  onClick={
                    goTo === 'addContent'
                      ? () => goToAddContent(elem, true, 'saved')
                      : () => getQuestions(elem.test_id, elem)
                  }
                >
                  <Col xs={2}>
                    <AssignmentOutlinedIcon />
                  </Col>
                  <Col xs={10} className='p-0'>
                    <h6 className='LiveClasses__adminHeading mb-0'>{elem.test_name}</h6>
                    <p className='LiveClasses__adminCardTime mb-0' style={{ fontSize: '10px' }}>
                      Created: {format(fromUnixTime(elem.created_at), 'HH:mm MMM dd, yyyy')}
                    </p>
                    <p className='Homework__dueDate mb-0'>
                      Created By: {elem.first_name} {elem.last_name}
                    </p>
                  </Col>
                </Row>
              );
            })}
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  clientUserId: getClientUserId(state),
  clientId: getClientId(state),
  roleArray: getRoleArray(state),
  testIdOld: getTestId(state),
  testNameOld: getTestName(state),
  selectedQuestionArray: getSelectedQuestionArray(state),
  currentChapterArray: getCurrentChapterArray(state),
  language: getHomeworkLanguageType(state),
  currentSubjectArray: getCurrentSubjectArray(state),
});

const mapDispatchToProps = (dispatch) => {
  return {
    setQuestionArrayToStore: (payload) => {
      dispatch(homeworkActions.setQuestionArrayToStore(payload));
    },
    setTestIsDraftToStore: (payload) => {
      dispatch(homeworkActions.setTestIsDraftToStore(payload));
    },
    setCurrentSlide: (payload) => {
      dispatch(homeworkActions.setCurrentSlide(payload));
    },
    setSelectedQuestionArrayToStore: (payload) => {
      dispatch(homeworkActions.setSelectedQuestionArrayToStore(payload));
    },
    setCourseAddContentTestIdToStore: (payload) => {
      dispatch(courseActions.setCourseAddContentTestIdToStore(payload));
    },
    setTestNameToStore: (payload) => {
      dispatch(homeworkActions.setTestNameToStore(payload));
    },
    setTestIdToStore: (payload) => {
      dispatch(homeworkActions.setTestIdToStore(payload));
    },
    setHomeworkLanguageTypeToStore: (payload) => {
      dispatch(homeworkActions.setHomeworkLanguageTypeToStore(payload));
    },
    clearTests: () => {
      dispatch(homeworkActions.clearTests());
    },
    setCurrentChapterArrayToStore: (payload) => {
      dispatch(homeworkActions.setCurrentChapterArrayToStore(payload));
    },
    setCurrentSubjectArrayToStore: (payload) => {
      dispatch(homeworkActions.setCurrentSubjectArrayToStore(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SavedSentTests);

SavedSentTests.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
    location: PropTypes.shape({
      state: PropTypes.shape({
        classId: PropTypes.instanceOf(Object),
        goTo: PropTypes.string,
        courseId: PropTypes.number,
        sectionId: PropTypes.number,
      }),
    }),
  }).isRequired,
  clientId: PropTypes.number.isRequired,
  setTestIsDraftToStore: PropTypes.func.isRequired,
  selectedQuestionArray: PropTypes.instanceOf(Array).isRequired,
  setTestIdToStore: PropTypes.func.isRequired,
  setCurrentSubjectArrayToStore: PropTypes.func.isRequired,
  setCurrentChapterArrayToStore: PropTypes.func.isRequired,
  setTestNameToStore: PropTypes.func.isRequired,
  currentChapterArray: PropTypes.instanceOf(Array).isRequired,
  currentSubjectArray: PropTypes.instanceOf(Array).isRequired,
  clientUserId: PropTypes.number.isRequired,
  roleArray: PropTypes.instanceOf(Array).isRequired,
  setCurrentSlide: PropTypes.func.isRequired,
  setQuestionArrayToStore: PropTypes.func.isRequired,
  setCourseAddContentTestIdToStore: PropTypes.func.isRequired,
  setSelectedQuestionArrayToStore: PropTypes.func.isRequired,
  clearTests: PropTypes.func.isRequired,
  testIdOld: PropTypes.number.isRequired,
  testNameOld: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  setHomeworkLanguageTypeToStore: PropTypes.func.isRequired,
};
