import React from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import PropTypes from 'prop-types';
import PhoneIcon from '@material-ui/icons/Phone';
import FaceIcon from '@material-ui/icons/Face';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import avatarImage from '../../assets/images/user.svg';

const UserDataCard = (props) => {
  const { elem, history } = props;

  return (
    <Card
      className='m-2 Admissions__card'
      key={elem.user_id}
      onClick={() => {
        history.push({ pathname: '/admissions/user', state: { user: elem } });
      }}
    >
      <Row className='ml-auto mx-2 pt-1'>
        <FaceIcon className='Fees__onlineIcon' />
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
              className='Fees__avatar'
            />
          </div>
          <div className='p-0'>
            <p className='Fees__avatarHeading mb-0 mt-2 ml-2'>
              {`${elem.first_name} ${elem.last_name}`}
            </p>
            <p className='Fees__avatarStatus'>
              <PhoneIcon className='Fees__onlineIcon' />
              +91-{elem.contact}
            </p>
          </div>
        </Col>
        <Col xs={4} className='p-0 my-auto text-right'>
          {elem.username ? (
            <span className='Dashboard__noticeSubHeading my-auto'>
              <PersonOutlineIcon className='Fees__onlineIcon' /> {elem.username}
            </span>
          ) : (
            <span className='Profile__batchStudents'>{elem.pin}</span>
          )}
        </Col>
      </Row>
    </Card>
  );
};

export default UserDataCard;

UserDataCard.propTypes = {
  elem: PropTypes.instanceOf(Object).isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
};
