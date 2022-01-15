import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import ArrowBack from '@material-ui/icons/ArrowBack';
import NotificationsIcon from '@material-ui/icons/Notifications';
import AssignmentIcon from '@material-ui/icons/AssignmentOutlined';
import EditIcon from '@material-ui/icons/Edit';
import { get, apiValidation } from '../../Utilities';
import { getClientId, getClientUserId } from '../../redux/reducers/clientUserId.reducer';
import { PageHeader } from '../Common/PageHeader/PageHeader';
import AdmissionStyle from '../Admissions/Admissions.style';
import avatarImage from '../../assets/images/user.svg';
import './OfflineAssignments.scss';

const StudOfflineMarks = (props) => {
  const { history } = props;
  const [studData, setStudData] = useState([]);
  const [test, setTest] = useState(history.location.state);

  useEffect(() => {
    const payload = {
      offline_test_id: test.offline_test_id,
      subject_array: JSON.stringify(test.subject_array),
    };
    // eslint-disable
    get(payload, `/getStudentsOfOfflineTest`).then((res) => {
      const result = apiValidation(res);
      setStudData(result);
      console.log(result);
    });
  }, [history]);

  const goToOflineAssignments = () => {
    history.push('/offlineassignments');
  };

  const goToEditPage = (e) => {
    history.push({
      pathname: `/offlineassignments/studentmarks/editmarks`,
      state: test,
    });
    console.log(e);
  };

  const customIcon = <EditIcon />;

  return (
    <>
      <PageHeader
        shadow
        title='Student Marks'
        customBack
        handleBack={goToOflineAssignments}
        customIcon={customIcon}
        handleCustomIcon={goToEditPage}
      />
      <div style={{ marginTop: '70px' }}>
        {/* <PageHeader title='' /> */}
        <Card className='card-main'>
          <div className='cardContainer '>
            <span className='icon grow1'>
              <AssignmentIcon />
            </span>
            <Card.Body className='body1'>
              <Card.Title className='titleTest'>{test.test_name}</Card.Title>
              <Card.Text className='mb-2 text-muted textMainTestCard'>
                {new Intl.DateTimeFormat('en-GB', {
                  year: 'numeric',
                  month: 'long',
                  day: '2-digit',
                }).format(test.created_at * 1000)}
              </Card.Text>
              {test.test_details && (
                <Card.Text className='textMainTestCard mb-0'>
                  Description
                  <p className='textMainTestCardp mb-0'>{test.test_details}</p>
                </Card.Text>
              )}
              <Card.Text className='textMainTestCard d-flex mb-0'>
                <p>To: </p>
                <p className='textMainTestCardp mb-0 ml-1'> {test.batch_array} </p>
              </Card.Text>
            </Card.Body>
            <Card.Body className='text-center grow1 mobilePadding0'>
              <p className='mb-3 mx-auto totalMarksTestCard'>Total marks</p>
              <Card.Title className='marks'>
                <span className='marks'>{test.total_marks}</span>
              </Card.Title>
            </Card.Body>
          </div>
        </Card>
        <div className='sms'>
          <p className='sms-txt'>
            <spam style={{ marginRight: '10px' }}>
              <NotificationsIcon />
            </spam>
            SMS results to parents
          </p>
        </div>
        {studData.map((ele) => {
          return (
            <div key={ele.offline_test_status_id} css={AdmissionStyle.UserCards}>
              <Card className='cardContainerOFA d-flex flex-row'>
                <div className='mt-2 ml-2'>
                  <img
                    src={ele.profile_image || avatarImage}
                    alt='avatar'
                    height='38'
                    width='38'
                    css={AdmissionStyle.avatar}
                    style={{ borderRadius: '50%' }}
                  />
                </div>
                <div className='w-100 m-auto NameAndProfileCardOFA'>
                  <div className='d-flex nameAndMarks'>
                    <div className='w-100'>
                      <p className='mb-3 mt-2 ml-2 paddingAdjust'>
                        {`${ele.first_name} ${ele.last_name}`}
                      </p>
                      <p
                        css={AdmissionStyle.avatarStatus}
                        className='mb-2 ml-2 color notattempted'
                        style={{ paddingLeft: '0px' }}
                      >
                        {ele.attempt_status === 'attempted' ? ` ` : <p>Not attempted</p>}
                      </p>
                    </div>
                    <div
                      xs={10}
                      sm={11}
                      style={{
                        paddingTop: '0px',
                        float: 'right',
                        textAlign: 'end',
                      }}
                    >
                      <p className='markdata'>
                        {ele.attempt_status === 'attempted' && !isNaN(ele.marks)
                          ? `${ele.marks}/${test.total_marks}`
                          : 'marks not filled'}
                      </p>
                    </div>
                  </div>
                  <div className='w-100'>
                    {ele.subject_marks?.map((e) => {
                      return ele.attempt_status === 'attempted' ? (
                        <div className='SubjectMarksContainer'>
                          <p className='subjectName mb-0'>{e.subject_name}</p>
                          <p className={`subjectMarks ${ele.marks === 'not filled' && 'grayText'}`}>
                            {e.marks}
                          </p>
                        </div>
                      ) : (
                        ''
                      );
                    })}
                  </div>
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  clientId: getClientId(state),
  clientUserId: getClientUserId(state),
  // currentSubjectArray: getCurrentSubjectArray(state),
});

export default connect(mapStateToProps, null)(StudOfflineMarks);

StudOfflineMarks.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
};
