import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import fromUnixTime from 'date-fns/fromUnixTime';
import format from 'date-fns/format';
import Swal from 'sweetalert2';
import { connect } from 'react-redux';
import dashboardAssignmentImage from '../../assets/images/Dashboard/dashboardAssignment.svg';

import { get, apiValidation, post } from '../../Utilities';
import { testsActions } from '../../redux/actions/tests.action';
import './Tests.scss';

const Homework = (props) => {
  const {
    clientUserId,
    searchString,
    setTestIdToStore,
    setTestResultArrayToStore,
    setTestLanguageToStore,
    setTestTypeToStore,
  } = props;
  const [homeworkToDisplay, sethomeworkToDisplay] = useState([]);
  const history = useHistory();

  useEffect(() => {
    let timer;
    if (searchString) {
      timer = setTimeout(() => {
        get({ client_user_id: clientUserId }, '/getHomeworkOfStudent').then((res) => {
          const result = apiValidation(res);
          const data = result.filter((elem) => {
            return elem.test_name.toLowerCase().includes(searchString);
          });
          sethomeworkToDisplay(data);
        });
      }, 500);
    } else {
      get({ client_user_id: clientUserId }, '/getHomeworkOfStudent').then((res) => {
        const result = apiValidation(res);
        sethomeworkToDisplay(result);
      });
    }

    return () => {
      clearTimeout(timer);
    };
  }, [searchString, clientUserId]);

  const startHomeworkTest = (elem) => {
    const payload = {
      client_user_id: clientUserId,
      test_id: elem.test_id,
      language_type: elem.language_type,
    };

    get(payload, '/getTestQuestionsForStudentWithLanguageLatest').then((res) => {
      console.log(res);
      Swal.fire({
        title: 'Your Homework is Loaded',
        text: 'hello',
        icon: 'success',
        showCloseButton: true,
        showCancelButton: true,
        confirmButtonText: `Attempt`,
        denyButtonText: `Later`,
        customClass: 'Assignments__SweetAlert',
      }).then((result) => {
        if (result.isConfirmed) {
          const response = apiValidation(res);
          startHomework(response, elem.test_id, elem.language_type);
        }
      });
      console.log(res);
    });
  };

  const startHomework = (responseArray, testId, languageType = 'english') => {
    const { push } = history;
    setTestResultArrayToStore(responseArray);
    setTestIdToStore(testId);
    setTestLanguageToStore(languageType);
    setTestTypeToStore('homework');
    push('/questiontaker');
  };

  if (!homeworkToDisplay.length) {
    return (
      <div className='noMatch'>
        <bold>No Homework found</bold>
      </div>
    );
  }

  return (
    <section className='Tests__scrollableCard divContainer'>
      {homeworkToDisplay.map((elem) => {
        return (
          <div
            key={elem.test_id}
            className='ml-2 secContainer'
            onClick={() => startHomeworkTest(elem)}
            onKeyDown={() => startHomeworkTest(elem)}
            tabIndex='-1'
            role='button'
          >
            <Row>
              <Col xs={9} className='pr-0'>
                <p className='Tests__scrollableCardHeading pt-2 pl-3 mb-0'>Homework</p>
                <p className='Tests__scrollableCardText pl-3 mt-1 mb-0'>{elem.test_name}</p>
                <p className='Tests__scrollableCardText pl-3 mt-1'>
                  Due:{' '}
                  <span className='Tests__Counter'>
                    {format(fromUnixTime(elem.due_date), 'MMM dd, yyyy')}
                  </span>
                </p>
              </Col>
              <Col xs={3} className='pt-3 px-0 livetestImg'>
                <img
                  src={dashboardAssignmentImage}
                  alt='assignment'
                  height='63px'
                  width='57px'
                  style={{
                    filter:
                      'invert(35%) sepia(80%) saturate(6195%) hue-rotate(211deg) brightness(102%) contrast(106%)',
                  }}
                />
              </Col>
            </Row>
          </div>
        );
      })}
    </section>
  );
};

const mapDispatchToProps = (dispatch) => ({
  setTestIdToStore: (payload) => {
    dispatch(testsActions.setTestIdToStore(payload));
  },
  setTestTypeToStore: (payload) => {
    dispatch(testsActions.setTestTypeToStore(payload));
  },

  setTestResultArrayToStore: (payload) => {
    dispatch(testsActions.setTestResultArrayToStore(payload));
  },
  setTestLanguageToStore: (payload) => {
    dispatch(testsActions.setTestLanguageToStore(payload));
  },
});

export default connect(null, mapDispatchToProps)(Homework);
Homework.propTypes = {
  clientUserId: PropTypes.number.isRequired,
  searchString: PropTypes.string.isRequired,
  setTestIdToStore: PropTypes.func.isRequired,
  setTestTypeToStore: PropTypes.func.isRequired,
  setTestResultArrayToStore: PropTypes.func.isRequired,
  setTestLanguageToStore: PropTypes.func.isRequired,
};

// <div>
//   {homework.map((i) => {
//     return <div id={i.test_id}>{i.test_name}</div>;
//   })}
// </div>
