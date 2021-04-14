/** @jsxImportSource @emotion/react */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ProgressBar from 'react-bootstrap/ProgressBar';
import './Analysis.scss';
import CloseIcon from '@material-ui/icons/Close';
import { getAnalysisStudentObject } from '../../redux/reducers/analysis.reducer';
import { PageHeader } from '../Common';
import { apiValidation, get } from '../../Utilities';
import AdmissionStyle from '../Admissions/Admissions.style';

const StudentList = (props) => {
  const { analysisStudentObject } = props;
  const [studentBatches, setStudentBatches] = useState([]);
  const [currentBatch, setCurrentBatch] = useState({});
  const [chapters, setChapters] = useState([]);
  const [topButtons, setTopButtons] = useState([
    {
      id: 1,
      heading: 'Performance',
      numerator: analysisStudentObject.performance,
      isPercent: true,
      isSelected: true,
    },
    {
      id: 2,
      heading: 'Test',
      numerator: analysisStudentObject.completed_test,
      denominator: analysisStudentObject.test_count,
      isPercent: false,
      isSelected: false,
    },
    {
      id: 3,
      heading: 'Homework',
      numerator: analysisStudentObject.completed_homework,
      denominator: analysisStudentObject.homework_count,
      isPercent: false,
      isSelected: false,
    },
    {
      id: 4,
      heading: 'Attendance',
      numerator: analysisStudentObject.attendance_percentage,
      isPercent: true,
      isSelected: false,
    },
  ]);

  useEffect(() => {
    get({ client_user_id: analysisStudentObject.client_user_id }, '/getBatchesOfStudent').then(
      (res) => {
        console.log(res);
        const result = apiValidation(res);
        setStudentBatches(result);
      },
    );
  }, [analysisStudentObject]);

  useEffect(() => {
    get(
      { client_user_id: analysisStudentObject.client_user_id },
      '/getChapterwiseAnalysisOfStudent',
    ).then((res) => {
      console.log(res);
      const result = apiValidation(res);
      setChapters(result);
    });

    get(
      { client_user_id: analysisStudentObject.client_user_id, client_batch_id: null },
      '/getBatchAttendanceAnalysisOfStudent',
    ).then((res) => {
      console.log(res);
    });
  }, [analysisStudentObject]);

  const selectThisButton = (id) => {
    const updatedButton = topButtons.map((e) => {
      if (e.id === id) e.isSelected = true;
      else e.isSelected = false;
      return e;
    });
    setTopButtons(updatedButton);
  };

  const selectBatch = (e) => {
    setCurrentBatch(e);
  };

  const removeBatch = () => {
    setCurrentBatch({});
  };

  return (
    <>
      <PageHeader
        title={`${analysisStudentObject.first_name} ${analysisStudentObject.last_name}`}
      />
      <div style={{ marginTop: '4rem' }}>
        <Row className='m-0'>
          {topButtons.map((elem) => {
            return (
              <Col xs={3} key={elem.id} className='text-center'>
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
                    className='Analysis__bigNumbers mb-0 pt-2'
                    style={
                      elem.isSelected === true
                        ? { color: '#fff', fontSize: '16px' }
                        : { color: 'rgba(0,0,0,0.54)', fontSize: '16px' }
                    }
                  >
                    {elem.isPercent ? (
                      <span>{elem.numerator}%</span>
                    ) : (
                      <span>
                        {elem.numerator}/{elem.denominator}
                      </span>
                    )}
                  </p>
                  <p
                    className='Analysis__cardLabel mb-0'
                    style={
                      elem.isSelected === true ? { color: '#fff' } : { color: 'rgba(0,0,0,0.54)' }
                    }
                  >
                    {elem.heading}
                  </p>
                </div>
              </Col>
            );
          })}
        </Row>
        <Row className='mx-3 mt-3'>
          <section css={AdmissionStyle.scrollable}>
            {Object.keys(currentBatch).length === 0 &&
              studentBatches.map((e) => {
                return (
                  <div
                    key={e.client_batch_id}
                    css={[AdmissionStyle.subjectBubble, AdmissionStyle.selected]}
                    onClick={() => selectBatch(e)}
                    onKeyDown={() => selectBatch(e)}
                    role='button'
                    tabIndex='-1'
                    style={{
                      backgroundColor: '#fff',
                      color: 'rgba(112, 112, 112, 1)',
                      border: '1px solid rgba(112, 112, 112, 1)',
                      height: '30px',
                      display: 'inline-block',
                      maxWidth: '90%',
                      whiteSpace: 'no-wrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      textAlign: 'center',
                      lineHeight: '28px',
                    }}
                  >
                    {e.batch_name}
                  </div>
                );
              })}

            {Object.keys(currentBatch).length > 0 && (
              <>
                <div
                  css={[AdmissionStyle.subjectBubble, AdmissionStyle.selected]}
                  style={{ backgroundColor: 'rgba(38, 153, 251, 1)', color: '#fff' }}
                >
                  {currentBatch.batch_name}
                </div>
                <div
                  css={AdmissionStyle.questionBubble}
                  onClick={() => removeBatch()}
                  onKeyDown={() => removeBatch()}
                  role='button'
                  tabIndex='-1'
                  style={{
                    backgroundColor: '#fff',
                    color: 'rgba(38, 153, 251, 1)',
                    border: '1px solid rgba(38, 153, 251, 1)',
                  }}
                >
                  <CloseIcon />
                </div>
              </>
            )}
          </section>
        </Row>

        {topButtons[0].isSelected &&
          chapters.length &&
          chapters.map((elem) => {
            return (
              <Card key={elem.chapter_id} className='m-2'>
                <p className='Analysis__studentSubHeading m-1'>{elem.chapter_name}</p>
                <ProgressBar now={elem.chapter_performance} className='m-2' />
              </Card>
            );
          })}

        {topButtons[1].isSelected && <div>wtf</div>}
        {topButtons[2].isSelected && <div>not cool </div>}
        {topButtons[3].isSelected && <div>attendance</div>}
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  analysisStudentObject: getAnalysisStudentObject(state),
});

export default connect(mapStateToProps)(StudentList);

StudentList.propTypes = {
  analysisStudentObject: PropTypes.instanceOf(Object).isRequired,
};
