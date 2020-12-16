import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import userAvatar from '../../assets/images/user.svg';
import { BackButton, DynamicForm } from '../Common';

const EditProfile = () => {
  const [image, setImage] = useState(userAvatar);
  const dataArray = [
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
  ];

  const getImageInput = (e) => {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onloadend = function getImage() {
      const base64data = reader.result;
      setImage(base64data);
    };
  };

  const getFormData = (values) => {
    console.log(values);
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
          />
          <input id='file-input' type='file' onChange={(e) => getImageInput(e)} accept='image/*' />
        </label>
      </div>

      <DynamicForm fields={dataArray} getData={getFormData} />
    </div>
  );
};

export default EditProfile;
