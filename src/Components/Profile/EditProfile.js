import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import parse from 'date-fns/parse';
import fromUnixTime from 'date-fns/fromUnixTime';
import format from 'date-fns/format';
import userAvatar from '../../assets/images/user.svg';
import { BackButton, DynamicForm } from '../Common';
import { post } from '../../Utilities';
import Cropper from '../Common/CropperModal/Cropper';

import '../Login/AdmissionChat/AdmissionForm/AdmissionForm.scss';
import { getClientId, getUserId, getUserUserId } from '../../redux/reducers/clientUserId.reducer';
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
    userUserId,
    userId,
    user,
    setFirstNameToStore,
    setLastNameToStore,
    setProfileImageToStore,
    setEmailToStore,
    setBirthdayToStore,
    setGenderToStore,
    setAddressToStore,
  } = props;
  const profileImage = useRef('');
  const [image, setImage] = useState(userAvatar);
  const [dataArray, setDataArray] = useState([
    { label: 'First Name', value: user.firstName, type: 'input', name: 'first_name' },
    { label: 'Last Name', value: user.lastName, type: 'input', name: 'last_name' },
    {
      label: 'Gender',
      value: user.gender,
      type: 'select',
      name: 'gender',
      data: ['Male', 'Female'],
    },
    { label: 'Email address', value: user.email, type: 'input', name: 'email' },
    // { label: 'Contact', value: user.contact, type: 'input', name: 'contact' },
    { label: 'Residential Address', value: user.address, type: 'input', name: 'address' },
    {
      label: 'Date of Birth',
      value: format(user.birthday ? fromUnixTime(user.birthday) : new Date(), 'yyyy-MM-dd'),
      type: 'date',
      name: 'birthday',
    },
  ]);
  const [imageModal, setImageModal] = useState(false);
  const [upImg, setUpImg] = useState();

  const handleClose = () => setImageModal(false);
  const handleOpen = () => setImageModal(true);

  useEffect(() => {
    console.log(data, 'data');
    if (fromAdmissions) {
      setDataArray(data);
      setImage(profileImagePath === '' ? userAvatar : profileImagePath);
    } else {
      setImage(
        profileImagePath !== ''
          ? profileImagePath
          : user.profileImage
          ? user.profileImage
          : userAvatar,
      );
    }
    console.log(fromAdmissions);
    //  setImage(profileImagePath === '' ? userAvatar : profileImagePath);
  }, [fromAdmissions, data, profileImagePath, user]);

  const getImageInput = (e) => {
    const reader = new FileReader();
    const file = e.target.files[0];
    handleOpen();
    if (file) {
      reader.addEventListener('load', () => setUpImg(reader.result));
      reader.readAsDataURL(e.target.files[0]);
      // reader.readAsDataURL(e.target.files[0]);
      // uploadImage(file).then((res) => {
      //   console.log('fileupload ', res);
      //   profileImage.current = res.filename;
      // });
      reader.onloadend = function getImage() {
        const base64data = reader.result;
        setImage(base64data);
      };
    }
  };

  const addProfileImage = (file) => {
    profileImage.current = file;
    console.log(file);
    const payload = {
      profile_image: file,
      user_id: userId,
    };
    post(payload, '/editProfilePicture').then((res) => {
      console.log(res, 'profilepic edit');
    });
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
        parent_name: values.parent_name === undefined ? '' : values.parent_name,
        parent_contact: values.parent_contact === undefined ? '' : values.parent_contact,
        parent_id: userUserId,
        birthday: parse(values.birthday, 'yyyy-MM-dd', new Date()).getTime() / 1000,
        // profile_image: profileImage.current,
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
              setAddressToStore(values.address);
              setBirthdayToStore(parse(values.birthday, 'yyyy-MM-dd', new Date()).getTime() / 1000);
              setGenderToStore(values.gender);
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
        <Cropper
          sourceImage={upImg}
          imageModal={imageModal}
          handleClose={handleClose}
          setProfileImage={addProfileImage}
          aspectTop={1}
          aspectBottom={1}
        />
      </div>

      <DynamicForm fields={dataArray} getData={getFormData} />
    </div>
  );
};

const mapStateToProps = (state) => ({
  clientId: getClientId(state),
  userId: getUserId(state),
  userUserId: getUserUserId(state),
  user: getUserProfile(state),
});

const mapDispatchToProps = (dispatch) => ({
  setFirstNameToStore: (payload) => dispatch(userProfileActions.setFirstNameToStore(payload)),
  setLastNameToStore: (payload) => dispatch(userProfileActions.setLastNameToStore(payload)),
  setEmailToStore: (payload) => dispatch(userProfileActions.setEmailToStore(payload)),
  setProfileImageToStore: (payload) => dispatch(userProfileActions.setProfileImageToStore(payload)),
  setBirthdayToStore: (payload) => {
    dispatch(userProfileActions.setBirthdayToStore(payload));
  },
  setGenderToStore: (payload) => {
    dispatch(userProfileActions.setGenderToStore(payload));
  },
  setAddressToStore: (payload) => {
    dispatch(userProfileActions.setAddressToStore(payload));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);

EditProfile.propTypes = {
  fromAdmissions: PropTypes.bool,
  data: PropTypes.instanceOf(Array),
  updateAdmissionProfile: PropTypes.func,
  profileImagePath: PropTypes.string,
  history: PropTypes.instanceOf(Object).isRequired,
  clientId: PropTypes.number.isRequired,
  userId: PropTypes.number.isRequired,
  userUserId: PropTypes.number.isRequired,
  user: PropTypes.instanceOf(Object).isRequired,
  setFirstNameToStore: PropTypes.func.isRequired,
  setLastNameToStore: PropTypes.func.isRequired,
  setEmailToStore: PropTypes.func.isRequired,
  setProfileImageToStore: PropTypes.func.isRequired,
  setBirthdayToStore: PropTypes.func.isRequired,
  setAddressToStore: PropTypes.func.isRequired,
  setGenderToStore: PropTypes.func.isRequired,
};

EditProfile.defaultProps = {
  fromAdmissions: false,
  data: [],
  updateAdmissionProfile: () => {},
  profileImagePath: '',
};
