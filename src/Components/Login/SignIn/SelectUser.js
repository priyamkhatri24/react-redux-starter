/** @jsxImportSource @emotion/react */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FaceIcon from '@material-ui/icons/Face';
import AdmissionStyle from '../../Admissions/Admissions.style';
import avatarImage from '../../../assets/images/user.svg';
import './SignIn.scss';

const SelectUser = (props) => {
  const { userInfo, getUserName } = props;

  useEffect(() => {
    console.log(userInfo, 'hahahaha');
    if (userInfo.length === 1) getUserName(userInfo[0].username);
  }, [userInfo, getUserName]);

  return (
    <>
      <h4 className='Signin__selectUserHeading text-center'>Select User</h4>
      {userInfo.length > 0 &&
        userInfo.map((elem) => {
          return (
            <Card
              key={elem.user_id}
              className='Signin__UserCard mx-auto m-1'
              onClick={() => getUserName(elem.username)}
            >
              <Row
                className='ml-auto mx-2 pt-1'
                style={{ marginBottom: '-10px', display: 'flex', alignItems: 'center' }}
              >
                <FaceIcon css={AdmissionStyle.onlineIcon} />
                <span
                  className='Signin_UserRole'
                  style={{ fontFamily: 'Montserrat-light', fontSize: '10px' }}
                >
                  {elem.role}
                </span>
              </Row>

              <Row className=' m-0 px-2 my-auto'>
                <Col xs={8} className='p-0 d-flex mb-3'>
                  <div className='m-1 '>
                    <img
                      src={elem.profile_image ? elem.profile_image : avatarImage}
                      alt='avatar'
                      // height='38'
                      // width='38'
                      css={AdmissionStyle.avatar}
                      className='Signin__userimage image my-auto'
                    />
                  </div>
                  <div className='p-0 d-flex align-items-center'>
                    {/* <p css={AdmissionStyle.avatarHeading} className='userName mb-0 mt-2 ml-2'> */}
                    <p className='userName mb-0 mt-2 ml-2'>
                      {`${elem.first_name} ${elem.last_name}`}
                    </p>
                  </div>
                </Col>
              </Row>
            </Card>
          );
        })}
    </>
  );
};

export default SelectUser;

SelectUser.propTypes = {
  userInfo: PropTypes.instanceOf(Array).isRequired,
  getUserName: PropTypes.func.isRequired,
};
