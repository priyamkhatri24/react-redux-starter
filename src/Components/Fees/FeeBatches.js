/** @jsxImportSource @emotion/react */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import CloseIcon from '@material-ui/icons/Close';
import Col from 'react-bootstrap/Col';
import ProgressBar from 'react-bootstrap/ProgressBar';
import AdmissionStyle from '../Admissions/Admissions.style';
import userAvatar from '../../assets/images/user.svg';
import '../Dashboard/Dashboard.scss';
import './Fees.scss';
import { apiValidation, get } from '../../Utilities';

const FeeBatches = (props) => {
  const { clientId, clientUserId, history } = props;

  const [filters, setFilters] = useState([]);
  const [currentClass, setCurrentClass] = useState({});
  const [currentSubject, setCurrentSubject] = useState({});
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    get({ client_id: clientId }, '/getFilters').then((res) => {
      console.log(res);
      const result = apiValidation(res);
      setFilters(result);
    });
  }, [clientId]);

  useEffect(() => {
    const payload = {
      class_id: Object.keys(currentClass).length === 0 ? null : currentClass.class_id,
      subject_id: Object.keys(currentSubject).length === 0 ? null : currentSubject.subject_id,
      client_user_id: clientUserId,
    };

    get(payload, '/getFeeDataForBatchesUsingFilter').then((res) => {
      console.log(res);
      const result = apiValidation(res);
      setBatches(result);
    });
  }, [clientUserId, currentSubject, currentClass]);

  const select = (type, e) => {
    switch (type) {
      case 'class':
        setCurrentClass(e);
        break;
      case 'subject':
        setCurrentSubject(e);
        break;
      default:
        console.log('hello');
    }
  };

  const remove = (type) => {
    switch (type) {
      case 'class':
        setCurrentClass({});
        break;
      case 'subject':
        setCurrentSubject({});
        break;
      default:
        console.log('hello');
    }
  };

  return (
    <div>
      {Object.keys(filters).length > 0 && (
        <Card.Body className='p-0'>
          <small css={AdmissionStyle.smallHeading} className='text-left mx-3 my-2'>
            Class
          </small>
          <Row className='mx-3'>
            <section
              css={AdmissionStyle.scrollable}
              style={{ backgroundColor: 'rgba(255, 255, 255, 1)' }}
            >
              {Object.keys(currentClass).length === 0 &&
                filters.class.map((e) => {
                  return (
                    <div
                      key={e.class_id}
                      css={AdmissionStyle.questionBubble}
                      onClick={() => select('class', e)}
                      onKeyDown={() => select('class', e)}
                      role='button'
                      tabIndex='-1'
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 1)',
                        color: 'rgba(112, 112, 112, 1)',
                        border: '1px solid rgba(112, 112, 112, 1)',
                      }}
                    >
                      {e.class_name}
                    </div>
                  );
                })}

              {Object.keys(currentClass).length > 0 && (
                <>
                  <div
                    css={AdmissionStyle.questionBubble}
                    style={{ backgroundColor: '#fff', color: '#000' }}
                  >
                    {currentClass.class_name}
                  </div>
                  <div
                    css={AdmissionStyle.questionBubble}
                    onClick={() => remove('class')}
                    onKeyDown={() => remove('class')}
                    role='button'
                    tabIndex='-1'
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                      color: '#000',
                      border: '1px solid rgba(112, 112, 112, 1)',
                    }}
                  >
                    <CloseIcon />
                  </div>
                </>
              )}
            </section>
          </Row>
          <hr />

          <>
            <small css={AdmissionStyle.smallHeading} className='text-left mx-3 my-2'>
              Subject
            </small>

            <Row className='mx-3'>
              <section
                css={AdmissionStyle.scrollable}
                style={{ backgroundColor: 'rgba(255, 255, 255, 1)' }}
              >
                {Object.keys(currentSubject).length === 0 &&
                  filters.subject.map((e) => {
                    return (
                      <div
                        key={e.subject_id}
                        css={[AdmissionStyle.subjectBubble, AdmissionStyle.selected]}
                        onClick={() => select('subject', e)}
                        onKeyDown={() => select('subject', e)}
                        role='button'
                        tabIndex='-1'
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 1)',
                          color: 'rgba(112, 112, 112, 1)',
                          border: '1px solid rgba(112, 112, 112, 1)',
                          height: '30px',
                        }}
                      >
                        {e.subject_name}
                      </div>
                    );
                  })}

                {Object.keys(currentSubject).length > 0 && (
                  <>
                    <div
                      css={[AdmissionStyle.subjectBubble, AdmissionStyle.selected]}
                      style={{ backgroundColor: '#fff', color: '#000' }}
                    >
                      {currentSubject.subject_name}
                    </div>
                    <div
                      css={AdmissionStyle.questionBubble}
                      onClick={() => remove('subject')}
                      onKeyDown={() => remove('subject')}
                      role='button'
                      tabIndex='-1'
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 1)',
                        color: '#000',
                        border: '1px solid rgba(112, 112, 112, 1)',
                      }}
                    >
                      <CloseIcon />
                    </div>
                  </>
                )}
              </section>
            </Row>
          </>
        </Card.Body>
      )}

      <div>
        {batches.map((elem) => {
          return (
            <Card
              className='m-2 p-2'
              key={elem.user_batch_id}
              style={{ borderRadius: '5px', border: '1px solid rgba(112, 112, 112, 0.1)' }}
              onClick={() =>
                history.push({
                  pathname: '/fees/users',
                  state: { batchId: elem.client_batch_client_batch_id, batchName: elem.batch_name },
                })
              } // eslint-disable-line
            >
              <Row>
                <Col xs={4} className='Fees__receivedAmount text-center my-auto'>
                  &#8377; {elem.total_paid_amount}
                </Col>
                <Col xs={4} className='text-center'>
                  <img
                    src={userAvatar}
                    className='Dashboard__profileImage img-responsive'
                    alt='profile'
                  />
                </Col>
                <Col
                  xs={4}
                  className='Fees__receivedAmount text-center my-auto'
                  style={{ color: 'rgba(255, 0, 0, 0.6)' }}
                >
                  &#8377; {elem.total_due_amount}
                </Col>
              </Row>
              <Row className='mx-auto m-3 Fees__orderSummary'>{elem.batch_name}</Row>
              <ProgressBar
                now={
                  elem.total_students === '0'
                    ? 0
                    : (1 -
                        parseInt(elem.total_due_students, 10) / parseInt(elem.total_students, 10)) *
                      100
                }
                label={`${parseInt(elem.total_due_students, 10)}/${parseInt(
                  elem.total_students,
                  10,
                )}`}
                style={{ borderRadius: '50px', height: '20px', color: 'rgba(127, 196, 253, 1)' }}
                className='m-2'
              />
              <p className='Fees__studentsPay mx-auto'>
                {`${parseInt(elem.total_due_students, 10)}/${parseInt(elem.total_students, 10)}`}{' '}
                Students Yet to Pay
              </p>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default FeeBatches;

FeeBatches.propTypes = {
  clientId: PropTypes.number.isRequired,
  clientUserId: PropTypes.number.isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
};
