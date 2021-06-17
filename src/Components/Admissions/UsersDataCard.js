/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import PhoneIcon from '@material-ui/icons/Phone';
import FaceIcon from '@material-ui/icons/Face';
import TimelapseIcon from '@material-ui/icons/Timelapse';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import { useInterval } from '../../Utilities';
import avatarImage from '../../assets/images/user.svg';
import { admissionActions } from '../../redux/actions/admissions.action';
import AdmissionStyle from './Admissions.style';

const DueTime = (props) => {
  const { unixTimeStamp, isTimerFinished } = props;
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    setHours(Math.floor(parseInt(unixTimeStamp, 10) / 3600));
    setMinutes(Math.floor(parseInt(unixTimeStamp, 10) / 60) % 60);
    setSeconds(Math.floor(parseInt(unixTimeStamp, 10)) % 60);
  }, [unixTimeStamp]);

  useInterval(() => {
    if (seconds > 0) {
      setSeconds(seconds - 1);
    }

    if (seconds === 0) {
      if (minutes === 0) {
        if (hours === 0) {
          isTimerFinished();
        } else {
          setMinutes(59);
          setHours(hours - 1);
        }
      } else {
        setMinutes(minutes - 1);
        setSeconds(59);
      }
    }
  }, 1000);

  return (
    <span className='Timer__time my-auto'>
      {hours < 10 ? `0${hours} hours` : `${hours} hours`}:{' '}
      {minutes < 10 ? `0${minutes} minutes` : `${minutes} minutes`}
      {/* :{seconds < 10 ? `0${seconds}` : seconds} */}
    </span>
  );
};

const UserDataCard = (props) => {
  const {
    elem,
    history,
    setAdmissionUserProfileToStore,
    FeeUser,
    notifyFeeUser,
    goToFeePlan,
  } = props;

  return (
    <Card
      css={AdmissionStyle.card}
      key={elem.user_id}
      onClick={
        FeeUser
          ? () => goToFeePlan(elem)
          : () => {
              setAdmissionUserProfileToStore(elem);
              history.push('/admissions/user');
            }
      }
    >
      {FeeUser === false && (
        <Row className='ml-auto mx-2 pt-1'>
          <FaceIcon css={AdmissionStyle.onlineIcon} />
          {elem.role_id.split(',').map((e, i) => {
            return (
              // eslint-disable-next-line
              <span style={{ fontSize: '8px', color: '#212121' }} className='my-auto' key={i}>
                {e.toString() === '1'
                  ? 'Student'
                  : e.toString() === '2'
                  ? 'Parent'
                  : e.toString() === '3'
                  ? 'Teacher'
                  : 'Admin'}
                {i !== elem.role_id.split(',').length - 1 && ','}
              </span>
            );
          })}
        </Row>
      )}
      <Row className=' m-0 px-2 my-auto'>
        <Col xs={8} className={FeeUser ? 'p-0 d-flex mt-2' : 'p-0 d-flex'}>
          <div className='m-1 '>
            <img
              src={elem.profile_image ? elem.profile_image : avatarImage}
              alt='avatar'
              height='38'
              width='38'
              css={AdmissionStyle.avatar}
            />
          </div>
          <div className='p-0'>
            <p css={AdmissionStyle.avatarHeading} className='mb-0 mt-2 ml-2'>
              {`${elem.first_name} ${elem.last_name}`}
            </p>
            <p css={AdmissionStyle.avatarStatus}>
              <PhoneIcon css={AdmissionStyle.onlineIcon} />
              +91-{elem.contact}
            </p>
          </div>
        </Col>
        {FeeUser ? (
          <Col xs={4} className='p-0 my-auto text-center'>
            {elem.is_fee === 'false' ? (
              <span css={AdmissionStyle.batchStudents}>No Plan</span>
            ) : elem.fee_status === 'paid' ? (
              <span
                css={AdmissionStyle.batchStudents}
                style={{ color: 'rgba(58, 255, 0, .87)', opacity: '0.26' }}
              >
                Paid
              </span>
            ) : (
              <>
                <span
                  css={AdmissionStyle.batchStudents}
                  style={{ color: 'rgba(255, 0, 0, 0.87)', opacity: '0.26' }}
                >
                  Due
                </span>
                {elem.time_remaining === 0 ? (
                  <Button
                    variant='courseBlueOnWhiteSmol'
                    onClick={(e) => {
                      e.stopPropagation();
                      notifyFeeUser(elem.user_id, elem.client_user_id);
                    }}
                  >
                    Notify
                  </Button>
                ) : (
                  <p
                    style={{ fontSize: '8px', lineHeight: '10px', color: 'rgba(0, 0, 0, 0.38)' }}
                    className='mb-0'
                  >
                    Notify will be available in <DueTime unixTimeStamp={elem.time_remaining} />{' '}
                    <span style={{ color: 'var(--primary-blue)' }}>
                      <TimelapseIcon />
                    </span>
                  </p>
                )}
              </>
            )}
          </Col>
        ) : (
          <Col xs={4} className='p-0 my-auto text-right'>
            {elem.username ? (
              <span css={AdmissionStyle.subHeading} className='my-auto'>
                <PersonOutlineIcon css={AdmissionStyle.onlineIcon} /> {elem.username}
              </span>
            ) : (
              <span css={AdmissionStyle.batchStudents}>{elem.pin}</span>
            )}
          </Col>
        )}
      </Row>
    </Card>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setAdmissionUserProfileToStore: (payload) => {
      dispatch(admissionActions.setAdmissionUserProfileToStore(payload));
    },
  };
};

export default connect(null, mapDispatchToProps)(UserDataCard);

UserDataCard.propTypes = {
  elem: PropTypes.instanceOf(Object).isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  setAdmissionUserProfileToStore: PropTypes.func.isRequired,
  FeeUser: PropTypes.bool,
  notifyFeeUser: PropTypes.func,
  goToFeePlan: PropTypes.func,
};

UserDataCard.defaultProps = {
  FeeUser: false,
  notifyFeeUser: () => {},
  goToFeePlan: () => {},
};

DueTime.propTypes = {
  unixTimeStamp: PropTypes.string.isRequired,
  isTimerFinished: PropTypes.func.isRequired,
};
