import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import parse from 'date-fns/parse';
import userAvatar from '../../assets/images/user.svg';
import { BackButton, DynamicForm } from '../Common';
import { post, uploadImage } from '../../Utilities';

import '../Login/AdmissionChat/AdmissionForm/AdmissionForm.scss';
import {
  getClientId,
  getClientUserId,
  getUserId,
  getUserUserId,
} from '../../redux/reducers/clientUserId.reducer';
import { getUserProfile } from '../../redux/reducers/userProfile.reducer';
import { userProfileActions } from '../../redux/actions/userProfile.action';

const EditProfile = (props) => {
  const {
    fromAdmissions,
    data,
    updateAdmissionProfile,
    profileImagePath,
    history,
    clientId,
    clientUserId,
    userUserId,
    userId,
    user,
    setFirstNameToStore,
    setLastNameToStore,
    setProfileImageToStore,
    setEmailToStore,
  } = props;
  const profileImage = useRef('');
  const [image, setImage] = useState(userAvatar);
  const [dataArray, setDataArray] = useState([
    { label: 'First Name', value: '', type: 'input', name: 'first_name' },
    { label: 'Last Name', value: '', type: 'input', name: 'last_name' },
    {
      label: 'Gender',
      value: 'Gender',
      type: 'select',
      name: 'gender',
      data: ['Male', 'Female'],
    },
    { label: 'Email address', value: '', type: 'input', name: 'email' },
    { label: 'Residential Address', value: '', type: 'input', name: 'address' },
    { label: 'Date of Birth', value: '', type: 'input', name: 'birthday' },
  ]);

  useEffect(() => {
    console.log(data);
    if (fromAdmissions) setDataArray(data);
    console.log(fromAdmissions);
    setImage(profileImagePath === '' ? userAvatar : profileImagePath);
  }, [fromAdmissions, data, profileImagePath]);

  const getImageInput = (e) => {
    const reader = new FileReader();
    const file = e.target.files[0];
    if (file) {
      reader.readAsDataURL(e.target.files[0]);
      uploadImage(file).then((res) => {
        console.log('fileu;lod ', res);
        profileImage.current = res.filename;
      });

      reader.onloadend = function getImage() {
        const base64data = reader.result;
        setImage(base64data);
      };
    }
  };

  const getFormData = (values) => {
    console.log(values);
    if (fromAdmissions) updateAdmissionProfile(values, profileImage.current);
    else {
      const payload = {
        first_name: values.first_name,
        last_name: values.last_name,
        contact: user.contact,
        email: values.email,
        address: values.address,
        gender: values.gender,
        user_id: userId,
        parent_name: values.parent_name === 'undefined' ? '' : values.parent_name,
        parent_contact: values.parent_contact === 'undefined' ? '' : values.parent_contact,
        parent_id: userUserId,
        birthday: parse(values.birthday, 'yyyy-MM-dd', new Date()).getTime(),
        profile_image: profileImage.current,
      };

      const payloadWhiteList = {
        white_list_id: user.white_list_id,
        client_id: clientId,
        name: values.first_name + values.last_name,
        contact: user.contact,
        parent_contact: values.parent_contact,
      };

      post(payload, '/editProfileByAdmin').then((res) => {
        console.log(res);
        if (res) {
          post(payloadWhiteList, '/editUserWhiteListData').then((resp) => {
            console.log(resp);
            if (res.success) {
              history.push('/');
              setFirstNameToStore(values.first_name);
              setLastNameToStore(values.last_name);
              setProfileImageToStore(profileImage.current);
              setEmailToStore(values.email);
            }
          });
        }
      });
    }
  };

  return (
    <div className='AdmissionForm'>
      <Row className='ml-4 mt-4'>
        <BackButton color='#000' />
        <span className='ml-3 AdmissionForm__navHeading'>Edit Profile</span>
      </Row>
      <div className='AdmissionForm__fileUpload text-center'>
        <label htmlFor='file-input'>
          <img
            src={image}
            alt='upload your profile pic'
            className='AdmissionForm__avatarImage my-5'
            style={{ height: '120px', width: '120px' }}
          />
          <input id='file-input' type='file' onChange={(e) => getImageInput(e)} accept='image/*' />
        </label>
      </div>

      <DynamicForm fields={fromAdmissions ? data : dataArray} getData={getFormData} />
    </div>
  );
};

const mapStateToProps = (state) => ({
  clientId: getClientId(state),
  clientUserId: getClientUserId(state),
  userId: getUserId(state),
  userUserId: getUserUserId(state),
  user: getUserProfile(state),
});

const mapDispatchToProps = (dispatch) => ({
  setFirstNameToStore: (payload) => dispatch(userProfileActions.setFirstNameToStore(payload)),
  setLastNameToStore: (payload) => dispatch(userProfileActions.setLastNameToStore(payload)),
  setEmailToStore: (payload) => dispatch(userProfileActions.setEmailToStore(payload)),
  setProfileImageToStore: (payload) => dispatch(userProfileActions.setProfileImageToStore(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);

EditProfile.propTypes = {
  fromAdmissions: PropTypes.bool,
  data: PropTypes.instanceOf(Array),
  updateAdmissionProfile: PropTypes.func,
  profileImagePath: PropTypes.string,
  history: PropTypes.instanceOf(Object).isRequired,
  clientId: PropTypes.number.isRequired,
  clientUserId: PropTypes.number.isRequired,
  userId: PropTypes.number.isRequired,
  userUserId: PropTypes.number.isRequired,
  user: PropTypes.instanceOf(Object).isRequired,
  setFirstNameToStore: PropTypes.func.isRequired,
  setLastNameToStore: PropTypes.func.isRequired,
  setEmailToStore: PropTypes.func.isRequired,
  setProfileImageToStore: PropTypes.func.isRequired,
};

EditProfile.defaultProps = {
  fromAdmissions: false,
  data: [],
  updateAdmissionProfile: () => {},
  profileImagePath: '',
};
