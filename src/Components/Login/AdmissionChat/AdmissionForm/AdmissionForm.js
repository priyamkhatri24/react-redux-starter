import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Swal from 'sweetalert2';
import { connect } from 'react-redux';
import {
  getClientId,
  getClientUserId,
  getUserId,
} from '../../../../redux/reducers/clientUserId.reducer';
import { getCurrentBranding } from '../../../../redux/reducers/branding.reducer';
import { getUserProfile } from '../../../../redux/reducers/userProfile.reducer';
import userAvatar from '../../../../assets/images/user.svg';
import './AdmissionForm.scss';
import { BackButton, DynamicForm } from '../../../Common';
import { get, uploadImage, post } from '../../../../Utilities/Remote';

const AdmissionForm = (props) => {
  // const dataArray = [
  //   { label: 'First Name', value: 'Sidhant', type: 'input', name: 'firstName' },
  //   { label: 'Last Name', value: '', type: 'input', name: 'LastName' },
  //   { label: 'Mobile Number', value: '', type: 'input', name: 'MobileNo' },
  //   { label: 'Parents Name', value: '', type: 'input', name: 'ParentsName ' },
  //   { label: 'Parents Mobile Number', value: '', type: 'input', name: 'ParentsMoNo' },
  //   {
  //     label: 'Gender',
  //     value: 'Gender',
  //     type: 'select',
  //     name: 'Gender',
  //     data: ['Male', 'Female'],
  //   },
  //   { label: 'Institute Name', value: '', type: 'input', name: 'InstituteName' },
  //   {
  //     label: 'Class',
  //     value: 'Class',
  //     type: 'select',
  //     name: 'Class',
  //     data: ['1', '2', '3', '4', '5', '6', '7', '8'],
  //   },
  //   { label: 'Email address', value: '', type: 'input', name: 'EmailAddress' },
  //   { label: 'Residential Address', value: '', type: 'input', name: 'Address' },
  //   { label: 'Date of Birth', value: '', type: 'input', name: 'DOB' },
  // ];

  const { clientId, clientUserId, currentbranding, userId, history, userProfile } = props;
  const [image, setImage] = useState(userAvatar);
  const [admissionFormData, setAdmissionFormData] = useState([]);
  const firstName = useRef({});
  const lastName = useRef({});
  const parentName = useRef({});
  const parentContact = useRef({});
  const profileImage = useRef('');
  const autoApproval = useRef('');

  useEffect(() => {
    const payload = {
      client_id: clientId,
      client_user_id: clientUserId,
    };
    get(payload, '/getAdmissionFormQuestionsForWeb').then((res) => {
      console.log(res, 'getAdmissionFormQuestions');
      autoApproval.current = res.auto_approval;
      const formData = res.result
        .filter((e) => e.placeholder !== 'profile_image')
        .map((e) => {
          if (e.placeholder === 'first_name') firstName.current.crm_question_id = e.crm_question_id;
          if (e.placeholder === 'last_name') lastName.current.crm_question_id = e.crm_question_id;
          if (e.placeholder === 'parent_name')
            parentName.current.crm_question_id = e.crm_question_id;
          if (e.placeholder === 'parent_contact')
            parentContact.current.crm_question_id = e.crm_question_id;

          const formElement = {
            label: e.english_text,
            value: e.response,
            type: e.question_type === 'subjective' ? 'input' : 'select',
            name: e.crm_question_id,
          };
          if (e.question_type === 'objective')
            formElement.data = e.english_options.map((elem) => elem.option_text);
          return formElement;
        });

      console.log(formData);
      setAdmissionFormData(formData);
    });
  }, [clientId, clientUserId]);

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

    const questionArray = Object.keys(values).map((key) => ({
      crm_question_id: Number(key),
      response: values[key],
    }));
    // .filter((elem) => {
    //   if (elem.crm_question_id === firstName.current.crm_question_id) {
    //     firstName.current.value = elem.response;
    //   } else if (elem.crm_question_id === lastName.current.crm_question_id) {
    //     lastName.current.value = elem.response;
    //   } else if (elem.crm_question_id === parentName.current.crm_question_id) {
    //     parentName.current.value = elem.response;
    //   } else if (elem.crm_question_id === parentContact.current.crm_question_id) {
    //     parentContact.current.value = elem.response;
    //   } else {
    //     return elem;
    //   }
    //   return null;
    // });
    console.log(questionArray);
    console.log(firstName.current);

    const payload = {
      client_user_id: clientUserId,
      user_id: userId,
      client_id: clientId,
      contact: userProfile.contact, // bnde ka
      question_array: JSON.stringify(questionArray),
      first_name: firstName.current.value,
      last_name: lastName.current.value,
      profile_image: profileImage.current,
      parent_name: parentName.current.value,
      parent_contact: parentContact.current.value,
      auto_approval: autoApproval.current,
    };
    console.log(payload);
    console.log(questionArray);
    post(payload, '/submitAdmissonFormLatest').then((res) => {
      if (res.success) {
        Swal.fire({
          icon: 'Success',
          text: 'Thank you for filling the admission form.',
        }).then((response) => {
          if (response.isConfirmed) history.push('/');
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Unable to reach our servers',
        });
      }
    });
  };

  return (
    <div className='AdmissionForm'>
      <Row className='ml-4 mt-4'>
        <BackButton color='#000' />
        <span className='ml-3 AdmissionForm__navHeading'>Complete Your Profile</span>
      </Row>
      <div className='AdmissionForm__fileUpload text-center'>
        <label htmlFor='file-input'>
          <img
            src={image}
            alt='upload your profile pic'
            width='200'
            height='200'
            className='rounded-circle'
          />
          <input id='file-input' type='file' onChange={(e) => getImageInput(e)} accept='image/*' />
        </label>
      </div>
      <label htmlFor='Name' className='has-float-label mx-4 my-1'>
        <input
          className='form-control'
          name='Name'
          type='text'
          placeholder='Your Name'
          // onChange={() => {})
        />
        <span>Name</span>
      </label>
      <DynamicForm fields={admissionFormData} getData={getFormData} />
    </div>
  );
};

const mapStateToProps = (state) => ({
  clientId: getClientId(state),
  clientUserId: getClientUserId(state),
  currentbranding: getCurrentBranding(state),
  userId: getUserId(state),
  userProfile: getUserProfile(state),
});

export default connect(mapStateToProps)(AdmissionForm);

AdmissionForm.propTypes = {
  clientId: PropTypes.number.isRequired,
  clientUserId: PropTypes.number.isRequired,
  currentbranding: PropTypes.shape({
    branding: PropTypes.shape({
      client_contact: PropTypes.string,
    }),
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  userId: PropTypes.number.isRequired,
  userProfile: PropTypes.instanceOf(Object).isRequired,
};
