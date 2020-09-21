import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import userAvatar from '../../../../assets/images/user.svg';
import './AdmissionForm.scss';
import { BackButton, DynamicForm } from '../../../Common';

const AdmissionForm = () => {
  const [image, setImage] = useState(userAvatar);
  const dataArray = [
    { label: 'First Name', value: 'Sidhant', type: 'input', name: 'firstName' },
    { label: 'Last Name', value: '', type: 'input', name: 'LastName' },
    { label: 'Mobile Number', value: '', type: 'input', name: 'MobileNo' },
    { label: 'Parents Name', value: '', type: 'input', name: 'ParentsName ' },
    { label: 'Parents Mobile Number', value: '', type: 'input', name: 'ParentsMoNo' },
    {
      label: 'Gender',
      value: 'Gender',
      type: 'select',
      name: 'Gender',
      data: ['Male', 'Female'],
    },
    { label: 'Institute Name', value: '', type: 'input', name: 'InstituteName' },
    {
      label: 'Class',
      value: 'Class',
      type: 'select',
      name: 'Class',
      data: ['1', '2', '3', '4', '5', '6', '7', '8'],
    },
    { label: 'Email address', value: '', type: 'input', name: 'EmailAddress' },
    { label: 'Residential Address', value: '', type: 'input', name: 'Address' },
    { label: 'Date of Birth', value: '', type: 'input', name: 'DOB' },
  ];

  const getImageInput = (e) => {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onloadend = function () {
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
        <span className='ml-3 AdmissionForm__navHeading'>Enquiry Form</span>
      </Row>
      <div className='AdmissionForm__fileUpload text-center'>
        <label htmlFor='file-input'>
          <img
            src={image}
            alt='upload your profile pic'
            className='AdmissionForm__avatarImage my-5'
          />
        </label>

        <input id='file-input' type='file' onChange={(e) => getImageInput(e)} accept='image/*' />
      </div>

      <DynamicForm fields={dataArray} getData={getFormData} />
    </div>
  );
};

export default AdmissionForm;
