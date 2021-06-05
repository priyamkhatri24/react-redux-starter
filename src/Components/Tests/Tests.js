import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import fromUnixTime from 'date-fns/fromUnixTime';
import compareAsc from 'date-fns/compareAsc';
import format from 'date-fns/format';
import Swal from 'sweetalert2';
import { connect } from 'react-redux';
import dashboardAssignmentImage from '../../assets/images/Dashboard/dashboardAssignment.svg';
import { get, apiValidation, post } from '../../Utilities';
import { getClientUserId } from '../../redux/reducers/clientUserId.reducer';
import LiveTestCounter from './LiveTestCounter';
import './Tests.scss';

const Tests = (props) => {
  const { clientUserId, startHomework, startLive } = props;
  const [homework, setHomework] = useState([]);
  const [liveTests, setLiveTests] = useState([]);
  const [demoTests, setDemoTests] = useState([]);
  const [allowLiveTest, setAllowLiveTest] = useState([]);

  useEffect(() => {
    get({ client_user_id: clientUserId }, '/getHomeworkOfStudent').then((res) => {
      const result = apiValidation(res);
      setHomework(result);
    });

    get({ client_user_id: clientUserId }, '/getAllTestOfStudent').then((res) => {
      const result = apiValidation(res);
      const [live, demo] = result.reduce(
        ([p, f], e) => (e.test_type === 'live test' ? [[...p, e], f] : [p, [...f, e]]),
        [[], []],
      );
      setLiveTests(live);
      setDemoTests(demo);
    });
  }, [clientUserId]);

  useEffect(() => {
    if (liveTests.length) {
      const falseArray = liveTests.map((e) => {
        const payload = {
          id: e.test_id,
          isAllowed: false,
          startTime: 0,
          endTime: 0,
        };
        return payload;
      });
      setAllowLiveTest(falseArray);
    }
  }, [liveTests]);

  const startHomeworkTest = (elem) => {
    const payload = {
      client_user_id: clientUserId,
      test_id: elem.test_id,
      language_type: elem.language_type,
    };

    get(payload, '/getTestQuestionsForStudentWithLanguageLatest').then((res) => {
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
          startHomework(response, elem.test_id);
        }
      });
      console.log(res);
    });
  };

  const isAllowed = useCallback(
    (bool, id, startTime, endTime) => {
      if (allowLiveTest.length) {
        const newCheckLiveExpiryArray = allowLiveTest.map((elem) => {
          if (elem.id === id) {
            elem.isAllowed = bool;
            elem.startTime = startTime;
            elem.endTime = endTime;
          }
          return elem;
        });
        setAllowLiveTest(newCheckLiveExpiryArray);
      }
    },
    [allowLiveTest],
  );

  const startLiveTest = (elem) => {
    console.log(elem, allowLiveTest);
    const liveCheck = allowLiveTest.filter((e) => {
      return e.id === elem.test_id;
    });
    if (liveCheck.length > 0 && liveCheck[0].isAllowed) {
      const payload = {
        client_user_id: clientUserId,
        test_id: elem.test_id,
        language_type: elem.language_type,
      };

      get(payload, '/getTestQuestionsForStudentWithLanguageLatest').then((res) => {
        Swal.fire({
          title: 'Your Live Test is Loaded',
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
            startLive(
              response,
              parseInt(liveCheck[0].startTime, 10),
              liveCheck[0].endTime,
              'livetest',
              elem.test_id,
            );
            console.log(response);
          }
        });
        console.log(res, 'live test');
      });
    }
  };

  const startDemoTest = (elem) => {
    const demoPayload = {
      test_id: elem.test_id,
      client_user_id: clientUserId,
    };

    get(demoPayload, '/getDemoTestEndTime').then((res) => {
      const result = apiValidation(res);
      console.log(result, 'endTime');
      if (result.status === 'Not started') {
        Swal.fire({
          text: 'Do you wish to attempt the test?',
          icon: 'question',
          showCloseButton: true,
          showCancelButton: true,
          confirmButtonText: `Attempt`,
          denyButtonText: `Later`,
          customClass: 'Assignments__SweetAlert',
        }).then((response) => {
          if (response.isConfirmed) {
            const testPayload = {
              client_user_id: clientUserId,
              test_id: elem.test_id,
              test_status: 'started',
            };

            post(testPayload, '/submitTest').then((testres) => {
              if (testres.success) {
                const demoTestPayload = {
                  client_user_id: clientUserId,
                  test_id: elem.test_id,
                  language_type: elem.language_type,
                };
                get(demoTestPayload, '/getTestQuestionsForStudentWithLanguageLatest').then((r) => {
                  console.log(r, 'r');
                  const studentQuestions = apiValidation(r);
                  startLive(
                    studentQuestions,
                    +new Date(),
                    +new Date() + parseInt(result.duration, 10) / 1000,
                    'demotest',
                    elem.test_id,
                  );
                });
              }
            });
          } else if (response.isDenied) {
            console.log('oh no');
          }
        });
      } else if (result.status === 'started') {
        const currentTime = fromUnixTime(result.current_time);
        const testStartTime = fromUnixTime(result.test_end_time);
        const dateResult = compareAsc(currentTime, testStartTime);
        console.log(dateResult);

        if (dateResult < 0) {
          const demoTestPayload = {
            client_user_id: clientUserId,
            test_id: elem.test_id,
            language_type: elem.language_type,
          };
          get(demoTestPayload, '/getTestQuestionsForStudentWithLanguageLatest').then((response) => {
            console.log(response);
            const studentQuestions = apiValidation(response);
            startLive(
              studentQuestions,
              result.current_time,
              result.test_end_time,
              'demotest',
              elem.test_id,
            );
          });
        } else if (dateResult > 0) {
          const testPayload = {
            client_user_id: clientUserId,
            test_id: elem.test_id,
            test_status: 'expired',
          };
          post(testPayload, '/submitTest').then((responseSubmit) => {
            if (responseSubmit.success) {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'The test has expired',
              });
            }
          });
        }
      } else if (result.status === 'expired') {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'The test has expired',
        });
      }
    });
  };

  return (
    <div>
      {liveTests.length > 0 && (
        <section className='Tests__scrollableCard'>
          {liveTests.map((elem) => {
            return (
              <div
                key={elem.test_id}
                className='ml-2'
                onClick={() => startLiveTest(elem)}
                onKeyDown={() => startLiveTest(elem)}
                tabIndex='-1'
                role='button'
              >
                <Row>
                  <Col xs={9} className='pr-0'>
                    <p className='Tests__scrollableCardHeading pt-2 pl-3 mb-0'>
                      <span style={{ color: 'rgba(255, 0, 0, 0.87)' }}>Live</span>{' '}
                      <span style={{ color: 'rgba(0, 0, 0, 0.87)' }}>Test</span>
                    </p>
                    <p className='Tests__scrollableCardText pl-3 mt-1'>{elem.test_name}</p>
                    <LiveTestCounter id={elem.test_id} isAllowed={isAllowed} />
                  </Col>
                  <Col xs={3} className='pt-3 px-0'>
                    <img
                      src={dashboardAssignmentImage}
                      alt='assignment'
                      height='63px'
                      width='57px'
                      style={{
                        filter:
                          'invert(16%) sepia(88%) saturate(7487%) hue-rotate(2deg) brightness(95%) contrast(117%)',
                      }}
                    />
                  </Col>
                </Row>
              </div>
            );
          })}
        </section>
      )}
      {demoTests.length > 0 && (
        <section className='Tests__scrollableCard'>
          {demoTests.map((elem) => {
            return (
              <div
                key={elem.test_id}
                className='ml-2'
                onClick={() => startDemoTest(elem)}
                onKeyDown={() => startDemoTest(elem)}
                tabIndex='-1'
                role='button'
              >
                <Row>
                  <Col xs={9} className='pr-0'>
                    <p className='Tests__scrollableCardHeading pt-2 pl-3 mb-0'>
                      <span style={{ color: 'rgba(207, 236, 0, 0.87)' }}>Demo</span>{' '}
                      <span style={{ color: 'rgba(0, 0, 0, 0.87)' }}>Test</span>
                    </p>
                    <p className='Tests__scrollableCardText pl-3 mt-1 mb-0'>{elem.test_name}</p>
                    <p className='Tests__scrollableCardText pl-3 mt-1'>
                      Due:{' '}
                      <span className='Tests__Counter'>
                        {format(fromUnixTime(elem.due_date), 'MMM dd, yyyy')}
                      </span>
                    </p>
                  </Col>
                  <Col xs={3} className='pt-3 px-0'>
                    <img
                      src={dashboardAssignmentImage}
                      alt='assignment'
                      height='63px'
                      width='57px'
                      style={{
                        filter:
                          'invert(79%) sepia(86%) saturate(518%) hue-rotate(10deg) brightness(95%) contrast(102%)',
                      }}
                    />
                  </Col>
                </Row>
              </div>
            );
          })}
        </section>
      )}
      {homework.length > 0 && (
        <section className='Tests__scrollableCard'>
          {homework.map((elem) => {
            return (
              <div
                key={elem.test_id}
                className='ml-2'
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
                  <Col xs={3} className='pt-3 px-0'>
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
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  clientUserId: getClientUserId(state),
});

export default connect(mapStateToProps)(Tests);

Tests.propTypes = {
  startHomework: PropTypes.func.isRequired,
  startLive: PropTypes.func.isRequired,
  clientUserId: PropTypes.number.isRequired,
};
