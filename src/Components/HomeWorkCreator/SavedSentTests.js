import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import fromUnixTime from 'date-fns/fromUnixTime';
import format from 'date-fns/format';
import { connect } from 'react-redux';
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';
import { PageHeader } from '../Common';
import { get, apiValidation } from '../../Utilities';
import {
  getClientId,
  getClientUserId,
  getRoleArray,
} from '../../redux/reducers/clientUserId.reducer';
import { homeworkActions } from '../../redux/actions/homework.action';
import { courseActions } from '../../redux/actions/course.action';

const SavedSentTests = (props) => {
  const {
    clientUserId,
    clientId,
    roleArray,
    history: { location: { state: { classId, goTo = null } } = {} } = {},
    setCurrentSlide,
    setQuestionArrayToStore,
    setCourseAddContentTestIdToStore,
    setSelectedQuestionArrayToStore,
    history,
    clearTests,
  } = props;
  const [sentTests, setSentTests] = useState([]);
  const [savedTests, setSavedTests] = useState([]);

  useEffect(() => {
    console.log(roleArray, 'roleeeearrraayyyy');
    const homeworkPayload = {
      client_user_id: clientUserId,
      is_admin: roleArray.includes(4) ? 'true' : 'false',
      client_id: clientId,
      class_id: goTo === 'addContent' ? null : classId.class_id,
    };

    const sentAssignmentPayload = {
      client_user_id: clientUserId,
      class_id: goTo === 'addContent' ? null : classId.class_id,
      client_batch_id: null,
      is_admin: roleArray.includes(4) ? 'true' : 'false',
      client_id: clientId,
      assignent_type: null,
    };

    get(homeworkPayload, '/getSavedHomeworksUsingFilters').then((res) => {
      const result = apiValidation(res);
      setSavedTests(result);
    });

    get(sentAssignmentPayload, '/getSentAssignmentsUsingFilter').then((res) => {
      const result = apiValidation(res);
      setSentTests(result);
    });
  }, [clientUserId, clientId, classId, roleArray, goTo]);

  const getQuestions = (testId) => {
    get({ test_id: testId }, '/getTestQuestions').then((res) => {
      console.log(res);
      const result = apiValidation(res);
      clearTests();
      if (goTo === 'addContent') {
        setCurrentSlide(1);
      } else {
        result.forEach((elem) => {
          elem.directFromSaved = true;
          elem.isSelected = true;
          elem.testIdOld = testId;
        });
        console.log(result, 'resultttttttttt');
        setCurrentSlide(2);
        setSelectedQuestionArrayToStore(result);
      }
      setQuestionArrayToStore(result);
      history.push('/homework');
    });
  };

  const goToAddContent = (testId, draft) => {
    history.push({ pathname: '/courses/createcourse/addcontent', state: { draft } });
    setCourseAddContentTestIdToStore(testId);
  };

  return (
    <div className='Assignments'>
      <PageHeader title='Tests' />
      <div style={{ marginTop: '5rem' }}>
        <Tabs defaultActiveKey='Sent Tests' className='Profile__Tabs' justify>
          <Tab eventKey='Sent Tests' title='Sent Tests'>
            {sentTests.map((elem) => {
              return (
                <Row
                  className='LiveClasses__adminCard p-2 m-3'
                  key={`elem${elem.test_id}`}
                  onClick={
                    goTo === 'addContent'
                      ? () => goToAddContent(elem.test_id, false)
                      : () => getQuestions(elem.test_id)
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
            {savedTests.map((elem) => {
              return (
                <Row
                  className='LiveClasses__adminCard p-2 m-3'
                  key={`elem${elem.test_id}`}
                  onClick={
                    goTo === 'addContent'
                      ? () => goToAddContent(elem.test_id, true)
                      : () => getQuestions(elem.test_id)
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
});

const mapDispatchToProps = (dispatch) => {
  return {
    setQuestionArrayToStore: (payload) => {
      dispatch(homeworkActions.setQuestionArrayToStore(payload));
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
    clearTests: () => {
      dispatch(homeworkActions.clearTests());
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
      }),
    }),
  }).isRequired,
  clientId: PropTypes.number.isRequired,
  clientUserId: PropTypes.number.isRequired,
  roleArray: PropTypes.instanceOf(Array).isRequired,
  setCurrentSlide: PropTypes.func.isRequired,
  setQuestionArrayToStore: PropTypes.func.isRequired,
  setCourseAddContentTestIdToStore: PropTypes.func.isRequired,
  setSelectedQuestionArrayToStore: PropTypes.func.isRequired,
  clearTests: PropTypes.func.isRequired,
};
