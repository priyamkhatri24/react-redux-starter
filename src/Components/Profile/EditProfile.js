import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import userAvatar from '../../assets/images/user.svg';
import { BackButton, DynamicForm } from '../Common';
import { uploadImage } from '../../Utilities';
import '../Login/AdmissionChat/AdmissionForm/AdmissionForm.scss';

const EditProfile = (props) => {
  const { fromAdmissions, data, updateAdmissionProfile, profileImagePath } = props;
  const profileImage = useRef('');
  const [image, setImage] = useState(userAvatar);
  const [dataArray, setDataArray] = useState([
    { label: 'First Name', value: 'Sidhant', type: 'input', name: 'firstName' },
    { label: 'Last Name', value: '', type: 'input', name: 'LastName' },
    {
      label: 'Gender',
      value: 'Gender',
      type: 'select',
      name: 'Gender',
      data: ['Male', 'Female'],
    },
    { label: 'Email address', value: '', type: 'input', name: 'EmailAddress' },
    { label: 'Residential Address', value: '', type: 'input', name: 'Address' },
    { label: 'Date of Birth', value: '', type: 'input', name: 'DOB' },
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

export default EditProfile;

EditProfile.propTypes = {
  fromAdmissions: PropTypes.bool,
  data: PropTypes.instanceOf(Array),
  updateAdmissionProfile: PropTypes.func,
  profileImagePath: PropTypes.string,
};

EditProfile.defaultProps = {
  fromAdmissions: false,
  data: [],
  updateAdmissionProfile: () => {},
  profileImagePath: '',
};
