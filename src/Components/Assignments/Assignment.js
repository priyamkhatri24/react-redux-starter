import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import fromUnixTime from 'date-fns/fromUnixTime';
import compareAsc from 'date-fns/compareAsc';
import format from 'date-fns/format';
import Swal from 'sweetalert2';
import { connect } from 'react-redux';
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';
import { PageHeader } from '../Common';
import { get, apiValidation, post } from '../../Utilities';
import './Assignment.scss';
import { getClientUserId } from '../../redux/reducers/clientUserId.reducer';

const Assignments = (props) => {
  const { clientUserId, history: { location: { state: type } = {} } = {} } = props;
  const [homework, setHomework] = useState([]);
  const [tests, setTests] = useState([]);
  const [assignmentType, setAssignmentType] = useState('');

  useEffect(() => {
    get({ client_user_id: clientUserId }, '/getHomeworkOfStudent').then((res) => {
      const result = apiValidation(res);
      setHomework(result);
    });

    get({ client_user_id: clientUserId }, '/getAllTestOfStudent').then((res) => {
      const result = apiValidation(res);
      setTests(result);
    });

    setAssignmentType(type);
  }, [clientUserId, type]);

  const startHomeworkTest = (elem) => {
    const payload = {
      client_user_id: clientUserId,
      test_id: elem.test_id,
      language_type: elem.language_type,
    };

    get(payload, '/getTestQuestionsForStudentWithLanguage').then((res) => {
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
          console.log('next');
        } else if (result.isDenied) {
          console.log('oh no');
        }
      });
      console.log(res);
    });
  };

  const startDemoTest = (elem) => {
    if (elem.test_type === 'live test') {
      get({ test_id: elem.test_id }, '/getTestAvailability').then((res) => {
        const result = apiValidation(res);
        if (result.status === '0') {
          const currentTime = fromUnixTime(result.current_time);
          const testStartTime = fromUnixTime(parseInt(result.test_start_time, 10));
          const dateResult = compareAsc(currentTime, testStartTime);
          if (dateResult > 0) {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'The test has expired',
            });
          } else if (dateResult < 0) {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'The test has not yet started',
            });
          }
        } else if (result.status === 1) {
          console.log('the live test shall start');
        }
        console.log(res);
      });
    } else if (elem.test_type === 'demo test') {
      const demoPayload = {
        test_id: elem.test_id,
        client_user_id: clientUserId,
      };

      get(demoPayload, '/getDemoTestEndTime').then((res) => {
        const result = apiValidation(res);
        console.log(result);
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
                  get(demoTestPayload, '/getTestQuestionsForStudentWithLanguage').then((r) =>
                    console.log(r),
                  );
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
            get(demoTestPayload, '/getTestQuestionsForStudentWithLanguage').then((res) =>
              console.log(res),
            );
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
      console.log(elem);

      // if(started ) ...
      // else (not started ) ask if want to stART? if yes show Timer.
    }
  };
  return (
    <div className='Assignments'>
      <PageHeader title={assignmentType} />
      <div style={{ marginTop: '5rem' }}>
        <Tabs defaultActiveKey='Homework' className='Profile__Tabs' justify>
          <Tab eventKey='Homework' title='Homework'>
            {homework.map((elem) => {
              return (
                <Row
                  className='LiveClasses__adminCard p-2 m-3'
                  key={`elem${elem.test_id}`}
                  onClick={() => startHomeworkTest(elem)}
                >
                  <Col xs={2}>
                    <AssignmentOutlinedIcon />
                  </Col>
                  <Col xs={10} className='p-0'>
                    <h6 className='LiveClasses__adminHeading mb-0'>{elem.test_name}</h6>
                    <p className='LiveClasses__adminCardTime mb-0' style={{ fontSize: '10px' }}>
                      Created: {format(fromUnixTime(elem.created_at), 'HH:mm MMM dd, yyyy')}
                    </p>
                    <p className='Assignments__dueDate mb-0'>
                      Due: {format(fromUnixTime(elem.due_date), 'HH:mm MMM dd, yyyy')}
                    </p>
                  </Col>
                </Row>
              );
            })}
          </Tab>
          <Tab eventKey='Test' title='Test'>
            {tests.map((elem) => {
              return (
                <Row
                  className='LiveClasses__adminCard p-2 m-3'
                  key={`elem${elem.test_id}`}
                  onClick={() => startDemoTest(elem)}
                >
                  <Col xs={2}>
                    <AssignmentOutlinedIcon />
                  </Col>
                  <Col xs={10} className='p-0'>
                    <h6 className='LiveClasses__adminHeading mb-0'>{elem.test_name}</h6>
                    <p className='LiveClasses__adminCardTime mb-0' style={{ fontSize: '10px' }}>
                      Created: {format(fromUnixTime(elem.created_at), 'HH:mm MMM dd, yyyy')}
                    </p>
                    <p className='Assignments__dueDate mb-0'>
                      Due: {format(fromUnixTime(elem.due_date), 'HH:mm MMM dd, yyyy')}
                    </p>
                  </Col>
                </Row>
              );
            })}
          </Tab>
          <Tab eventKey='Attachments' title='Attachments'>
            cjvjfkddfdfdfdvjf
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  clientUserId: getClientUserId(state),
});

export default connect(mapStateToProps)(Assignments);
