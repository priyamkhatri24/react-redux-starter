import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { getClientId } from '../../redux/reducers/clientUserId.reducer';
import { getAnalysisAssignmentObject } from '../../redux/reducers/analysis.reducer';
import { PageHeader } from '../Common';
import { apiValidation, get, propComparator } from '../../Utilities';
import userAvatar from '../../assets/images/user.svg';
import '../Dashboard/Dashboard.scss';
import './Analysis.scss';

const AssignmentList = (props) => {
  const { analysisAssignmentObject } = props;
  const [students, setStudents] = useState([]);
  const [topButtons, setTopButtons] = useState([
    {
      id: 1,
      heading: 'Completed',
      numerator: analysisAssignmentObject.total_submission,
      denominator: analysisAssignmentObject.total_student,
      isSelected: true,
    },
    {
      id: 2,
      heading: 'Lowest',
      numerator: analysisAssignmentObject.minimum_marks,
      denominator: analysisAssignmentObject.total_questions,
      isSelected: false,
    },
    {
      id: 3,
      heading: 'Highest',
      numerator: analysisAssignmentObject.maximum_marks,
      denominator: analysisAssignmentObject.total_questions,
      isSelected: false,
    },
  ]);

  useEffect(() => {
    console.log(analysisAssignmentObject);
    get({ test_id: analysisAssignmentObject.test_id }, '/getScoresOfTestLatest').then((res) => {
      console.log(res);
      const result = apiValidation(res);
      setStudents(result);
    });
  }, [analysisAssignmentObject]);

  const selectThisButton = (id) => {
    const updatedButton = topButtons.map((e) => {
      if (e.id === id) e.isSelected = true;
      else e.isSelected = false;
      return e;
    });
    setTopButtons(updatedButton);
    if (id === 1) {
      get({ test_id: analysisAssignmentObject.test_id }, '/getScoresOfTestLatest').then((res) => {
        console.log(res);
        const result = apiValidation(res);
        setStudents(result);
      });
    } else if (id === 2) {
      const notAttempted = students.filter((e) => e.status === 'not attempted');
      const attempted = students
        .filter((e) => e.status !== 'not attempted')
        .sort(propComparator('score'));
      const final = [...notAttempted, ...attempted];
      setStudents(final);
    } else {
      const notAttempted = students.filter((e) => e.status === 'not attempted');
      const attempted = students
        .filter((e) => e.status !== 'not attempted')
        .sort(propComparator('score'))
        .reverse();
      const final = [...attempted, ...notAttempted];
      setStudents(final);
    }
  };

  return (
    <>
      <PageHeader title={analysisAssignmentObject.test_name} />
      <div style={{ marginTop: '4rem' }}>
        <Row className='m-0'>
          {topButtons.map((elem) => {
            return (
              <Col xs={4} key={elem.id} className='text-center'>
                <div
                  style={
                    elem.isSelected
                      ? {
                          backgroundColor: '#7FC4FD',
                          border: '1px solid #7FC4FD',
                          color: '#fff',
                          width: '70px',
                          height: '60px',
                          borderRadius: '10px',
                        }
                      : {
                          border: '1px solid rgba(0,0,0,0.54)',
                          color: 'rgba(0,0,0,0.54)',
                          width: '70px',
                          height: '60px',
                          borderRadius: '10px',
                        }
                  }
                  className='mx-auto'
                  onClick={() => selectThisButton(elem.id)}
                  onKeyDown={() => selectThisButton(elem.id)}
                  role='button'
                  tabIndex='-1'
                >
                  <p
                    className='Analysis__bigNumbers mb-0'
                    style={
                      elem.isSelected === true ? { color: '#fff' } : { color: 'rgba(0,0,0,0.54)' }
                    }
                  >
                    {elem.numerator}/{elem.denominator}
                  </p>
                  <p
                    className='Analysis__cardLabel mb-0'
                    style={
                      elem.isSelected === true ? { color: '#fff' } : { color: 'rgba(0,0,0,0.54)' }
                    }
                  >
                    {' '}
                    {elem.heading}
                  </p>
                </div>
              </Col>
            );
          })}
        </Row>
        <Row className='justify-content-between mx-2 my-4'>
          <Button variant='customPrimarySmol'>SMS results to parents</Button>
          <Button variant='customPrimarySmol'>Download report</Button>
        </Row>
        {students.map((elem) => {
          return (
            <Row
              className='m-0 p-2'
              key={elem.client_user_id}
              style={{
                borderBottom: '1px solid rgba(0, 0, 0, 0.54)',
                fontFamily: 'Montserrat-Regular',
              }}
            >
              <Col xs={2}>
                <img src={userAvatar} alt='profile' className='Dashboard__noticeImage d-block' />
              </Col>
              <Col xs={5} className='my-auto'>
                {elem.first_name} {elem.last_name}
              </Col>
              <Col xs={5} className='my-auto text-center'>
                {elem.status === 'not attempted' ? 'Not attempted' : elem.score}
              </Col>
            </Row>
          );
        })}
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  clientId: getClientId(state),
  analysisAssignmentObject: getAnalysisAssignmentObject(state),
});

export default connect(mapStateToProps)(AssignmentList);

AssignmentList.propTypes = {
  analysisAssignmentObject: PropTypes.instanceOf(Object).isRequired,
};
