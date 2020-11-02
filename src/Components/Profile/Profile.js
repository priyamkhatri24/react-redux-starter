import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Button from 'react-bootstrap/Button';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import CreateIcon from '@material-ui/icons/Create';
import { userProfileActions } from '../../redux/actions/userProfile.action';
import { getUserProfile } from '../../redux/reducers/userProfile.reducer';
import { getClientId, getClientUserId } from '../../redux/reducers/clientUserId.reducer';
import { PageHeader } from '../Common';
import { get, post, apiValidation } from '../../Utilities';
import userImage from '../../assets/images/user.svg';
import './Profile.scss';

const Profile = (props) => {
  const { clientId, clientUserId, userProfile, clearProfile, history } = props;
  const [batches, setBatches] = useState([]);

  const logout = () => {
    const logoutPayload = {
      client_user_id: clientUserId,
    };
    post(logoutPayload, '/logoutUser')
      .then((res) => {
        const result = apiValidation(res);
        if (result) {
          clearProfile();
          history.push({ pathname: '/login' });
        }
      })
      .catch(() => alert('Logout Unsuccessful. Please check your network connection.'));
  };

  useEffect(() => {
    const batchPayload = {
      client_id: clientId,
      client_user_id: clientUserId,
    };

    get(batchPayload, '/getBatchInformationOfUser').then((res) => {
      const result = apiValidation(res);
      console.log(result);
      setBatches(result.current_batch);
    });
  }, [clientId, clientUserId]);

  const goToEditProfile = () => {
    history.push('/editProfile');
  };

  return (
    <div className='Profile'>
      <PageHeader title='Profile' />
      <div style={{ marginTop: '6rem' }}>
        <Col className='text-center'>
          <img
            src={userProfile.profileImage ? userProfile.profileImage : userImage}
            width='100'
            height='100'
            alt='profile'
            className='rounded-circle'
          />
          <p className='Profile__mainName my-3'>{`${userProfile.firstName} ${userProfile.lastName}`}</p>
        </Col>
        <Tabs defaultActiveKey='Details' className='Profile__Tabs' justify>
          <Tab eventKey='Details' title='Details'>
            <div className='LiveClasses__adminCard p-2 m-3' style={{ position: 'relative' }}>
              <div className='Profile__edit text-center py-1' onClick={() => goToEditProfile()}>
                <CreateIcon />
              </div>
              <h6 className='LiveClasses__adminHeading mb-0'>First Name</h6>
              <p className='LiveClasses__adminDuration '>{userProfile.firstName}</p>

              <h6 className='LiveClasses__adminHeading mb-0'>Mobile Number</h6>
              <p className='LiveClasses__adminDuration '>{userProfile.contact}</p>

              <h6 className='LiveClasses__adminHeading mb-0'>Username</h6>
              <p className='LiveClasses__adminDuration '>userame aega yahan</p>

              <Row className='justify-content-end mb-2 mb-lg-4 mr-2'>
                <Button variant='customPrimary' size='sm' onClick={() => logout()}>
                  Logout{' '}
                  <span>
                    <PowerSettingsNewIcon />
                  </span>
                </Button>
              </Row>
            </div>
          </Tab>
          <Tab eventKey='Batches' title='Batches'>
            <Row className='justify-content-center'>
              {batches.map((elem) => {
                return (
                  <Col xs={5} key={elem.client_batch_id} className='p-2 StudyBin__box my-2 mx-2'>
                    <>
                      <span className='Dashboard__verticalDots'>
                        <MoreVertIcon />
                      </span>
                      <div className='m-2 text-center'>
                        <img src={userImage} alt='batchpic' height='40' width='40' />
                        <h6 className='text-center mt-3 Profile__batchName'>{elem.batch_name}</h6>
                        <p className='Profile__batchStudents mb-0'>{elem.number_of_students}</p>
                        <p className='Profile__students'>students</p>
                      </div>
                    </>
                  </Col>
                );
              })}
            </Row>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  clientId: getClientId(state),
  clientUserId: getClientUserId(state),
  userProfile: getUserProfile(state),
});

const mapDispatchToProps = (dispatch) => {
  return {
    clearProfile: () => {
      dispatch(userProfileActions.clearUserProfile());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
