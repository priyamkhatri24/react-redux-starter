import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import parse from 'date-fns/parse';
import { getAdmissionUserProfile } from '../../redux/reducers/admissions.reducer';
import { getClientId, getClientUserId, getUserId } from '../../redux/reducers/clientUserId.reducer';
import EditProfile from '../Profile/EditProfile';
import { post } from '../../Utilities';
import { userProfileActions } from '../../redux/actions/userProfile.action';

const EditProfileHOC = (props) => {
  const { history, user, clientId, clientUserId, userId } = props;
  const [formDataArray, setFormDataArray] = useState([]);

  useEffect(() => {
    let teacherArray = [];
    const dataArray = [
      { label: 'First Name', value: user.first_name, type: 'input', name: 'first_name' },
      { label: 'Last Name', value: user.last_name, type: 'input', name: 'last_name' },
      {
        label: 'Gender',
        value: 'Gender',
        type: 'select',
        name: 'gender',
        data: ['Male', 'Female'],
      },
      { label: 'Email address', value: user.email, type: 'input', name: 'email' },
      {
        label: 'Residential Address',
        value: user.address,
        type: 'input',
        name: 'address',
      },
      {
        label: 'Date of Birth',
        value: user.birthday,
        type: 'date',
        name: 'birthday',
      },
      { label: "Parent's Name", value: user.parent_name, type: 'input', name: 'parent_name' },
      {
        label: "Parent's Contact",
        value: user.parent_contact,
        type: 'number',
        name: 'parent_contact',
      },
    ];

    if (user.role_id !== '1') {
      teacherArray = dataArray.filter(
        (e) => e.name !== 'parent_name' && e.name !== 'parent_contact',
      );
    }

    setFormDataArray(user.role_id !== '1' ? teacherArray : dataArray);
  }, [user]);

  const getFormData = (values, image) => {
    console.log(values);
    console.log(image);

    const payload = {
      first_name: values.first_name,
      last_name: values.last_name,
      contact: user.contact,
      email: values.email,
      address: values.address,
      birthday: parse(values.birthday, 'yyyy-MM-dd', new Date()).getTime(),
      gender: values.gender,
      user_id: user.user_id,
      parent_name: values.parent_name === 'undefined' ? '' : values.parent_name,
      parent_contact: values.parent_contact === 'undefined' ? '' : values.parent_contact,
      parent_id: user.user_user_id,
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
            history.push('/admissions');
          }
        });
      }
    });
  };

  return (
    <EditProfile
      data={formDataArray}
      updateAdmissionProfile={getFormData}
      fromAdmissions
      profileImagePath={user.profile_image}
    />
  );
};

const mapStateToProps = (state) => ({
  clientId: getClientId(state),
  clientUserId: getClientUserId(state),
  userId: getUserId(state),
  user: getAdmissionUserProfile(state),
});

export default connect(mapStateToProps)(EditProfileHOC);

EditProfileHOC.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
  user: PropTypes.instanceOf(Object).isRequired,
  clientId: PropTypes.number.isRequired,
  clientUserId: PropTypes.number.isRequired,
  userId: PropTypes.number.isRequired,
};
