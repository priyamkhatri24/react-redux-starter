/** @jsx jsx */

import { jsx } from '@emotion/react';
import { connect } from 'react-redux';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import PropTypes from 'prop-types';
import PhoneIcon from '@material-ui/icons/Phone';
import FaceIcon from '@material-ui/icons/Face';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import avatarImage from '../../assets/images/user.svg';
import { admissionActions } from '../../redux/actions/admissions.action';
import AdmissionStyle from './Admissions.style';

const UserDataCard = (props) => {
  const { elem, history, setAdmissionUserProfileToStore } = props;

  return (
    <Card
      css={AdmissionStyle.card}
      key={elem.user_id}
      onClick={() => {
        setAdmissionUserProfileToStore(elem);
        history.push('/admissions/user');
      }}
    >
      <Row className='ml-auto mx-2 pt-1'>
        <FaceIcon css={AdmissionStyle.onlineIcon} />
        {elem.role_id.split(',').map((e, i) => {
          return (
            // eslint-disable-next-line
            <span style={{ fontSize: '8px', color: '#212121' }} className='my-auto' key={i}>
              {e === '1' ? 'Student' : e === '2' ? 'Parent' : e === '3 ' ? 'Teacher' : 'Admin'}
              {i !== elem.role_id.split(',').length - 1 && ','}
            </span>
          );
        })}
      </Row>
      <Row className=' m-0 px-2'>
        <Col xs={8} className='p-0 d-flex'>
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
        <Col xs={4} className='p-0 my-auto text-right'>
          {elem.username ? (
            <span css={AdmissionStyle.subHeading} className='my-auto'>
              <PersonOutlineIcon css={AdmissionStyle.onlineIcon} /> {elem.username}
            </span>
          ) : (
            <span css={AdmissionStyle.batchStudents}>{elem.pin}</span>
          )}
        </Col>
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
};
