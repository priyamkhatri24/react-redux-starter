/** @jsxImportSource @emotion/react */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ProgressBar from 'react-bootstrap/ProgressBar';
import './Analysis.scss';
import { getAnalysisStudentObject } from '../../redux/reducers/analysis.reducer';
import { getRoleArray } from '../../redux/reducers/clientUserId.reducer';
import { PageHeader } from '../Common';
import { apiValidation, get } from '../../Utilities';
import AdmissionStyle from '../Admissions/Admissions.style';
import AnalysisCalendar from './AnalysisCalendar';
import AnalysisTestsCard from './AnalysisTestsCard';
import AssignmentCards from '../OfflineAssignments/AssignmentCards';

const StudentList = (props) => {
  const { analysisStudentObject, history, roleArray } = props;
  const [studentBatches, setStudentBatches] = useState([]);
  const [currentBatch, setCurrentBatch] = useState({
    client_batch_id: 0,
    batch_name: 'All',
    isSelected: true,
  });
  const [chapters, setChapters] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [tests, setTests] = useState([]);
  const [offlineAssignments, setOfflineAssignments] = useState([]);
  const [homework, setHomework] = useState([]);
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
      numerator:
        roleArray.includes(1) || roleArray.includes(2)
          ? analysisStudentObject.test_done
          : analysisStudentObject.completed_test,
      denominator: analysisStudentObject.test_count,
      isPercent: false,
      isSelected: false,
    },
    {
      id: 3,
      heading: 'Homework',
      numerator:
        roleArray.includes(1) || roleArray.includes(2)
          ? analysisStudentObject.homework_done
          : analysisStudentObject.completed_homework,
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
    {
      id: 5,
      heading: 'Offline assignments',
      numerator: analysisStudentObject.completed_offline_test,
      denominator: analysisStudentObject.total_offline_test,
      isPercent: false,
      isSelected: false,
    },
  ]);

  useEffect(() => {
    get({ client_user_id: analysisStudentObject.client_user_id }, '/getBatchesOfStudent').then(
      (res) => {
        console.log(res);
        const result = apiValidation(res).map((elem) => {
          elem.isSelected = false;
          return elem;
        });

        setStudentBatches([{ client_batch_id: 0, batch_name: 'All', isSelected: true }, ...result]);
      },
    );
  }, [analysisStudentObject]);

  useEffect(() => {
    get(
      { client_user_id: analysisStudentObject.client_user_id },
      '/getChapterwiseAnalysisOfStudent',
    ).then((res) => {
      const result = apiValidation(res);
      setChapters(result);
    });
    console.log(analysisStudentObject);
  }, [analysisStudentObject]);

  useEffect(() => {
    const payload = {
      client_user_id: analysisStudentObject.client_user_id,
      client_batch_id: currentBatch.client_batch_id,
    };

    if (currentBatch.client_batch_id !== 0) {
      get(payload, '/getBatchAttendanceAnalysisOfStudent').then((res) => {
        const result = apiValidation(res);
        setAttendance(result);
      });

      get(payload, '/getAllSubmittedBatchTestAnalysisOfStudent').then((res) => {
        console.log(res, 'tests');
        const result = apiValidation(res);
        setTests(result);
      });

      get(payload, '/getAllSubmittedBatchHomeworkAnalysisOfStudent').then((res) => {
        console.log(res);
        const result = apiValidation(res);
        setHomework(result);
      });
    } else {
      get(
        { client_user_id: analysisStudentObject.client_user_id },
        '/getAllSubmittedTestAnalysisOfStudent',
      ).then((res) => {
        console.log(res, 'hahaaa');
        const result = apiValidation(res);
        setTests(result);
      });
      get(
        { client_user_id: analysisStudentObject.client_user_id },
        '/getAllOfflineTestAnalysisOfStudent',
      ).then((res) => {
        console.log(res, 'offline assignments');
        const result = apiValidation(res);
        setOfflineAssignments(result);
      });

      get(
        { client_user_id: analysisStudentObject.client_user_id },
        '/getAllSubmittedHomeworkAnalysisOfStudent',
      ).then((res) => {
        console.log(res);
        const result = apiValidation(res);
        setHomework(result);
      });
    }
  }, [analysisStudentObject, currentBatch]);

  const selectThisButton = (id) => {
    const updatedButton = topButtons.map((e) => {
      if (e.id === id) e.isSelected = true;
      else e.isSelected = false;
      return e;
    });
    setTopButtons(updatedButton);

    if (id !== 4) {
      const newBatches = [
        { client_batch_id: 0, batch_name: 'All', isSelected: true },
        ...studentBatches
          .filter((e) => e.client_batch_id !== 0)
          .map((e) => {
            e.isSelected = false;
            return e;
          }),
      ];
      setStudentBatches(newBatches);
    } else {
      const newBatches = studentBatches.slice(1).map((e) => {
        e.isSelected = false;
        return e;
      });
      newBatches[0].isSelected = true;
      setCurrentBatch(newBatches[0]);
      setStudentBatches(newBatches);
    }
  };

  const selectBatch = (e) => {
    setCurrentBatch(e);
    const newBatches = studentBatches.map((elem) => {
      if (elem.client_batch_id === e.client_batch_id) {
        elem.isSelected = true;
      } else elem.isSelected = false;
      return elem;
    });
    setStudentBatches(newBatches);
  };

  // const removeBatch = () => {
  //   setCurrentBatch({});
  // };

  return (
    <>
      <PageHeader
        title={`${analysisStudentObject.first_name} ${analysisStudentObject.last_name}`}
      />
      <div style={{ marginTop: '4rem' }}>
        <div className='m-0 rowMargin d-flex justify-content-between'>
          {topButtons.map((elem) => {
            return (
              <div key={elem.id} className='text-center'>
                <div
                  style={
                    elem.isSelected
                      ? {
                          backgroundColor: '#7FC4FD',
                          border: '1px solid #7FC4FD',
                          color: '#fff',
                          borderRadius: '10px',
                        }
                      : {
                          border: '1px solid rgba(0,0,0,0.54)',
                          color: 'rgba(0,0,0,0.54)',
                          borderRadius: '10px',
                        }
                  }
                  className='mx-auto Analysis__Buttons pb-1'
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
                    {elem.isPercent ||
                    (analysisStudentObject.isStudent && elem.heading !== 'Offline assignments') ? (
                      <span>
                        {elem.numerator === 'Student has not attempted any questions yet' ||
                        elem.numerator === 'Student has not completed any homework yet' ||
                        elem.numerator === 'Student has not completed any test yet' ||
                        elem.numerator === 'There are no attendance records yet'
                          ? '0%'
                          : `${elem.numerator}%`}
                      </span>
                    ) : (
                      <span>{`${elem.numerator}/${elem.denominator}`}</span>
                    )}
                  </p>
                  <p
                    className='Analysis__cardLabel pb-1'
                    style={
                      elem.isSelected === true ? { color: '#fff' } : { color: 'rgba(0,0,0,0.54)' }
                    }
                  >
                    {elem.heading}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <Row className='Analysis__filterRow '>
          <section css={AdmissionStyle.scrollable}>
            {studentBatches.map((e) => {
              return (
                <div
                  key={e.client_batch_id}
                  css={[AdmissionStyle.subjectBubble, AdmissionStyle.selected]}
                  onClick={() => selectBatch(e)}
                  onKeyDown={() => selectBatch(e)}
                  role='button'
                  tabIndex='-1'
                  style={
                    e.isSelected
                      ? {
                          color: '#fff',
                          backgroundColor: 'rgba(38, 153, 251, 1)',
                          border: '1px solid rgba(112, 112, 112, 1)',
                          height: '30px',
                          display: 'inline-block',
                          maxWidth: '90%',
                          whiteSpace: 'no-wrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          textAlign: 'center',
                          lineHeight: '28px',
                          minWidth: '120px',
                        }
                      : {
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
                          minWidth: '120px',
                        }
                  }
                >
                  {e.batch_name}
                </div>
              );
            })}
          </section>
        </Row>

        {topButtons[0].isSelected &&
          (chapters.length > 0 ? (
            chapters.map((elem) => {
              return (
                <Card key={elem.chapter_id} className='Analysis__card'>
                  <p className='Analysis__studentSubHeading m-1'>{elem.chapter_name}</p>
                  <ProgressBar now={elem.chapter_performance} className='m-2' />
                </Card>
              );
            })
          ) : (
            <div className='Analysis__PlaceholderText'>
              <span>No performance yet</span>
            </div>
          ))}

        {topButtons[1].isSelected &&
          (tests.length > 0 ? (
            tests.map((elem) => {
              return (
                <AnalysisTestsCard
                  key={elem.test_id}
                  name={elem.test_name}
                  date={elem.date}
                  maxMarks={elem.total_questions}
                  marksObtained={elem.correct_questions}
                  history={history}
                  testId={elem.test_id}
                  clientUserId={elem.client_user_id}
                  language={elem.language_type}
                />
              );
            })
          ) : (
            <div className='Analysis__PlaceholderText'>
              <span>No tests to show</span>
            </div>
          ))}
        {topButtons[2].isSelected &&
          (homework.length > 0 ? (
            homework.map((elem) => {
              console.log(elem, 'klkkkkkklklk');
              return (
                <AnalysisTestsCard
                  key={elem.test_id}
                  name={elem.test_name}
                  date={elem.date}
                  maxMarks={elem.total_questions}
                  marksObtained={elem.correct_questions}
                  history={history}
                  testId={elem.test_id}
                  clientUserId={elem.client_user_id}
                  language={elem.language_type}
                />
              );
            })
          ) : (
            <div className='Analysis__PlaceholderText'>
              <span>No Homework to show</span>
            </div>
          ))}
        {topButtons[3].isSelected && (
          <div className='d-flex justify-content-center mt-3'>
            <AnalysisCalendar attendance={attendance} />
          </div>
        )}
        <div style={{ width: '95%', margin: 'auto' }}>
          {topButtons[4].isSelected &&
            (offlineAssignments.length > 0 ? (
              offlineAssignments.map((elem) => {
                console.log(elem, 'offlineee');
                return (
                  // <AnalysisTestsCard
                  //   key={elem.offline_test_id}
                  //   name={elem.test_name}
                  //   date={elem.test_date}
                  //   maxMarks={elem.total_marks}
                  //   marksObtained={elem.marks}
                  //   history={history}
                  //   testId={elem.offline_test_id}
                  //   clientUserId={analysisStudentObject.client_user_id}
                  //   language={elem.language_type}
                  // />
                  <AssignmentCards
                    testName={elem.test_name}
                    firstName={elem.first_name}
                    lastName={elem.last_name}
                    createdAt={elem.created_at}
                    testDetails={elem.test_details}
                    totalMarks={elem.total_marks}
                    batchArray={elem.batch_array}
                    testId={elem.offline_test_id}
                    marks={elem.marks}
                    subjectMarks={elem.subject_array}
                  />
                );
              })
            ) : (
              <div className='Analysis__PlaceholderText'>
                <span>No Offline assignments to show</span>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  analysisStudentObject: getAnalysisStudentObject(state),
  roleArray: getRoleArray(state),
});

export default connect(mapStateToProps)(StudentList);

StudentList.propTypes = {
  analysisStudentObject: PropTypes.instanceOf(Object).isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  roleArray: PropTypes.instanceOf(Array).isRequired,
};
