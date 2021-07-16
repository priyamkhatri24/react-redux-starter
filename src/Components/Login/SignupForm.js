import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import Button from 'react-bootstrap/Button';
import 'react-image-crop/dist/ReactCrop.css';
import Signup from '../../assets/images/Login/ProfilePic.svg';
import './Login.scss';
import { post } from '../../Utilities';
import { userProfileActions } from '../../redux/actions/userProfile.action';
import { getUserProfile } from '../../redux/reducers/userProfile.reducer';
import { getClientId } from '../../redux/reducers/clientUserId.reducer';
import Cropper from '../Common/CropperModal/Cropper';

const SignupForm = (props) => {
  const {
    setFirstNameToStore,
    setLastNameToStore,
    setEmailToStore,
    history,
    setProfileImageToStore,
    clientId,
    userProfile,
  } = props;

  const [details, setDetails] = useState({ first_name: '', last_name: '', email: '' });
  const profileImageRef = useRef(null);
  const [upImg, setUpImg] = useState();
  const [imageModal, setImageModal] = useState(false);
  const [profileImage, setProfileImage] = useState('');

  const handleClose = () => setImageModal(false);
  const handleOpen = () => setImageModal(true);

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setUpImg(reader.result));
      reader.readAsDataURL(e.target.files[0]);
      handleOpen();
    }
  };

  const goToOtp = () => {
    const payload = {
      contact: userProfile.contact,
      client_id: clientId,
      country_code: userProfile.countryCode,
    };
    post(payload, '/enterNumberAndSendOTPForCRM').then((res) => {
      console.log(res);
      if (res.success) {
        setFirstNameToStore(details.first_name);
        setLastNameToStore(details.last_name);
        setEmailToStore(details.email);
        setProfileImageToStore(profileImage);
        history.push('/signup');
      }
    });
  };

  return (
    <>
      <Row className='mx-2 mt-4'>
        <Col xs={7} className='align-self-end Login__signupHeading'>
          Help us know you better :)
        </Col>
        <Col xs={5}>
          <img src={Signup} alt='login person' width='120px' height='125px' />
        </Col>
      </Row>
      <input
        type='file'
        name='upload-photo'
        id='upload-photo'
        onChange={onSelectFile}
        style={{ display: 'none' }}
        ref={profileImageRef}
      />
      {profileImage ? (
        <div
          style={{ position: 'relative', width: '70px', height: '70px', borderRadius: '70px' }}
          className='ml-4 mt-4'
          onClick={() => profileImageRef.current.click()}
          onKeyDown={() => profileImageRef.current.click()}
          tabIndex='-1'
          role='button'
        >
          <img
            src={profileImage}
            alt='profile'
            style={{ width: '70px', height: '70px', borderRadius: '70px' }}
          />
          <span className='Login__camera'>
            <PhotoCameraIcon />
          </span>
        </div>
      ) : (
        <div
          className='Login__photoPlaceHolder mt-4 ml-4'
          onClick={() => profileImageRef.current.click()}
          onKeyDown={() => profileImageRef.current.click()}
          tabIndex='-1'
          role='button'
        >
          Add Photo
          <span className='Login__camera'>
            <PhotoCameraIcon />
          </span>
        </div>
      )}
      <small
        className='ml-4'
        style={{
          fontSize: '10px',
          lineHeight: '13px',
          color: 'rgba(0, 0, 0, 0.87)',
          fontFamily: 'Montserrat-Light',
        }}
      >
        Profile picture (optional)
      </small>

      <div className='mx-3 mt-5 pb-4'>
        <label className='has-float-label my-auto'>
          <input
            className='form-control'
            name='First Name'
            type='text'
            placeholder='First Name'
            value={details.first_name}
            onChange={(e) => {
              const newObject = {
                ...details,
                first_name: e.target.value,
              };
              setDetails(newObject);
            }}
          />
          <span>First Name</span>
        </label>

        <label className='has-float-label my-auto'>
          <input
            className='form-control mt-3'
            name='Last Name'
            type='text'
            placeholder='Last Name'
            value={details.last_name}
            onChange={(e) => {
              const newObject = {
                ...details,
                last_name: e.target.value,
              };
              setDetails(newObject);
            }}
          />
          <span>Last Name</span>
        </label>

        <label className='has-float-label my-auto'>
          <input
            className='form-control mt-3'
            name='Email address(optional)'
            type='text'
            placeholder='Email address(optional)'
            value={details.email}
            onChange={(e) => {
              const newObject = {
                ...details,
                email: e.target.value,
              };
              setDetails(newObject);
            }}
          />
          <span>Email address(optional)</span>
        </label>
        <Button variant='loginPrimary' className='mt-5' onClick={() => goToOtp()}>
          Send OTP
        </Button>
      </div>

      <Cropper
        sourceImage={upImg}
        imageModal={imageModal}
        handleClose={handleClose}
        setProfileImage={setProfileImage}
        aspectTop={1}
        aspectBottom={1}
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  userProfile: getUserProfile(state),
  clientId: getClientId(state),
});

const mapDispatchToProps = (dispatch) => {
  return {
    setFirstNameToStore: (payload) => {
      dispatch(userProfileActions.setFirstNameToStore(payload));
    },
    setLastNameToStore: (payload) => {
      dispatch(userProfileActions.setLastNameToStore(payload));
    },
    setEmailToStore: (payload) => {
      dispatch(userProfileActions.setEmailToStore(payload));
    },
    setProfileImageToStore: (payload) => {
      dispatch(userProfileActions.setProfileImageToStore(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignupForm);

SignupForm.propTypes = {
  setFirstNameToStore: PropTypes.func.isRequired,
  setLastNameToStore: PropTypes.func.isRequired,
  setEmailToStore: PropTypes.func.isRequired,
  setProfileImageToStore: PropTypes.func.isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  userProfile: PropTypes.instanceOf(Object).isRequired,
  clientId: PropTypes.number.isRequired,
};
