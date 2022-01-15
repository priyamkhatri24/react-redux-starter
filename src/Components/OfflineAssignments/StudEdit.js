import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import ArrowBack from '@material-ui/icons/ArrowBack';
import CheckIcon from '@material-ui/icons/Check';
import CancelIcon from '@material-ui/icons/Cancel';
import { get, apiValidation, post } from '../../Utilities';
import { getClientId, getClientUserId } from '../../redux/reducers/clientUserId.reducer';
import { PageHeader } from '../Common/PageHeader/PageHeader';
import AdmissionStyle from '../Admissions/Admissions.style';
import avatarImage from '../../assets/images/user.svg';
import './OfflineAssignments.scss';

const StudEdit = (props) => {
  const { history } = props;
  const [studInfo, setStudInfo] = useState([]);
  const [input, setInput] = useState();
  const [test, setTest] = useState(history.location.state);

  useEffect(() => {
    const payload = {
      offline_test_id: test.offline_test_id,
      subject_array: JSON.stringify(test.subject_array),
    };
    // eslint-disable
    get(payload, `/getStudentsOfOfflineTest`).then((res) => {
      const result = apiValidation(res);
      setStudInfo(result);
      console.log(result, 'getStudentOfOfflineTest');
    });
  }, [history]);

  const updateStudentData = () => {
    const finalStudentsData = studInfo.map((ele) => {
      if (!ele.marks) {
        ele.marks = 'not filled';
      }
      ele.subject_marks.forEach((elem) => {
        if (!elem.marks) {
          elem.marks = 'not filled';
        }
      });
      return ele;
    });
    const finalInfo = finalStudentsData.map((ele) => {
      ele.subject_marks = JSON.stringify(ele.subject_marks);
      return ele;
    });
    const payload = {
      offline_test_id: test.offline_test_id,
      marks_array: JSON.stringify(finalInfo),
    };
    // eslint-disable
    console.log(payload);
    post(payload, `/addOfflineTestMarks`).then((res) => {
      console.log(res);
      goToStudentPage();
    });
  };

  const goToStudentPage = () => {
    history.push({ pathname: `/offlineassignments/studentmarks`, state: test });
  };

  const updateAttemptStatus = (elem, status) => {
    const newStudentsInfo = studInfo.map((ele) => {
      if (ele.client_user_id === elem.client_user_id) {
        ele.attempt_status = status;
        if (status === 'not attempted') {
          ele.marks = 'not filled';
          ele.subject_marks.forEach((subject) => (subject.marks = 'not filled'));
        }
      }
      return ele;
    });
    setStudInfo(newStudentsInfo);
    console.log(studInfo);
  };

  const updateTotalMarks = (e, student) => {
    const newStudentInfo = studInfo.map((ele) => {
      if (ele.client_user_id === student.client_user_id) {
        ele.marks = e.target.value;
        if (+ele.marks > +test.total_marks) {
          ele.total_marks_alert = true;
        } else {
          ele.total_marks_alert = false;
        }
      }
      return ele;
    });
    setStudInfo(newStudentInfo);
    console.log(studInfo);
  };

  const updateStudentMarks = (e, student, subject) => {
    const newStudentInfo = studInfo.map((ele) => {
      let newMarks = 0;
      let marksString = '';
      if (ele.client_user_id === student.client_user_id) {
        const newSubjectArray = ele.subject_marks.map((sub) => {
          if (sub.subject_name === subject) {
            sub.marks = e.target.value;
          }
          marksString += sub.marks;
          newMarks += +sub.marks;
          return sub;
        });
        ele.subject_marks = newSubjectArray;

        ele.marks = newMarks.toString();
        if (marksString === '') ele.marks = '';
        if (+ele.marks > +test.total_marks) {
          ele.total_marks_alert = true;
        } else {
          ele.total_marks_alert = false;
        }
      }
      return ele;
    });
    setStudInfo(newStudentInfo);
    console.log(studInfo);
  };

  const customIcon = <CheckIcon className=' ml-1 hover' style={{ cursor: 'pointer' }} />;

  return (
    <>
      <PageHeader
        shadow
        title='Edit Marks'
        editIcon
        customBack
        handleBack={goToStudentPage}
        customIcon={customIcon}
        handleCustomIcon={updateStudentData}
      />
      <div style={{ marginTop: '70px' }}>
        {studInfo.map((ele) => {
          return (
            <div key={ele.offilne_test_status_id} css={AdmissionStyle.UserCards}>
              <Card className='cardStudentMarksEdit d-flex flex-row'>
                <div>
                  <div>
                    <img
                      src={ele.profile_image || avatarImage}
                      alt='avatar'
                      height='38'
                      width='38'
                      css={AdmissionStyle.avatar}
                      style={{ borderRadius: '50%' }}
                    />
                  </div>
                </div>
                <div className='w-100'>
                  <div
                    style={{ width: '95%' }}
                    className='px-2 my-auto d-flex justify-content-between align-items-center'
                  >
                    <div
                      className='body1'
                      style={{
                        paddingTop: '10px',
                        alignItems: 'start',
                        padding: '0 0',
                        paddingLeft: '6px',
                      }}
                    >
                      <p className='mb-0 mt-2 ml-2'>{`${ele.first_name} ${ele.last_name}`}</p>
                    </div>
                    <div>
                      <p
                        className='mb-0 mt-2 ml-2 totalMarksEditPageOFA'
                        style={{ float: 'right' }}
                      >
                        {ele.attempt_status === 'attempted' && !isNaN(ele.marks)
                          ? `${ele.marks}/${test.total_marks}`
                          : null}
                      </p>
                    </div>
                  </div>
                  {ele.total_marks_alert && (
                    <p className='exceedingMarksAlert'>*Marks is exceeding total marks.</p>
                  )}
                  <form className='ml-2 marksForm'>
                    {ele.attempt_status === 'attempted' && ele.subject_marks.length > 0
                      ? ele.subject_marks.map((sub) => {
                          return (
                            <label className='has-float-label my-3'>
                              <input
                                className='form-control'
                                name='marks'
                                type='text'
                                placeholder={sub.subject_name}
                                value={sub.marks === 'not filled' ? '' : sub.marks}
                                onChange={(e) => updateStudentMarks(e, ele, sub.subject_name)}
                              />
                              <span>{sub.subject_name}</span>
                            </label>
                          );
                        })
                      : null}
                    {ele.attempt_status === 'attempted' && !ele.subject_marks.length ? (
                      <label className='has-float-label my-3'>
                        <input
                          className='form-control'
                          name='marks'
                          type='text'
                          placeholder='Enter marks'
                          value={ele.marks === 'not filled' ? '' : ele.marks}
                          onChange={(e) => updateTotalMarks(e, ele)}
                        />
                        <span>Enter marks</span>
                      </label>
                    ) : null}
                  </form>
                  <div className='attemptNotAttemptContainer'>
                    {ele.attempt_status === 'attempted' ? (
                      <button
                        onClick={() => updateAttemptStatus(ele, 'not attempted')}
                        className='button2'
                        type='button'
                      >
                        Did not attempt?
                      </button>
                    ) : (
                      <button
                        onClick={() => updateAttemptStatus(ele, 'attempted')}
                        className='button2 noBorder mt-2 px-0'
                        type='button'
                      >
                        Not attempted <CancelIcon className='ml-2' />
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          );
        })}
        ;
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  clientId: getClientId(state),
  // testId: getTestId(state),
  clientUserId: getClientUserId(state),
  // currentSubjectArray: getCurrentSubjectArray(state),
});

StudEdit.propTypes = {
  // clientId: PropTypes.number.isRequired,
  // clientUserId: PropTypes.number.isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  // testId: PropTypes.number.isRequired,
  // currentSubjectArray: PropTypes.instanceOf(Array).isRequired,
};

export default connect(mapStateToProps, null)(StudEdit);
