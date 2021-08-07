import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import parse from 'date-fns/parse';
import fromUnixTime from 'date-fns/fromUnixTime';
import format from 'date-fns/format';
import { getAdmissionUserProfile } from '../../redux/reducers/admissions.reducer';
import {
  getClientId,
  getClientUserId,
  getRoleArray,
  getUserId,
} from '../../redux/reducers/clientUserId.reducer';
import EditProfile from '../Profile/EditProfile';
import { post } from '../../Utilities';
// import { userProfileActions } from '../../redux/actions/userProfile.action';

const EditProfileHOC = (props) => {
  const { history, user, clientId } = props;
  const [formDataArray, setFormDataArray] = useState([]);

  useEffect(() => {
    const currentUser = history.location.state.user;
    console.log(currentUser, 'Hello');
    let teacherArray;
    const dataArray = [
      {
        label: 'First Name',
        value: currentUser.first_name,
        type: 'input',
        name: 'first_name',
      },
      {
        label: 'Last Name',
        value: currentUser.last_name,
        type: 'input',
        name: 'last_name',
      },
      {
        label: 'Gender',
        value: currentUser.gender,
        type: 'select',
        name: 'gender',
        data: ['Male', 'Female'],
      },
      {
        label: 'Email address',
        value: currentUser.email,
        type: 'input',
        name: 'email',
      },
      {
        label: 'Contact',
        value: currentUser.contact,
        type: 'input',
        name: 'contact',
      },
      {
        label: 'Residential Address',
        value: currentUser.address || '',
        type: 'input',
        name: 'address',
      },
      {
        label: 'Date of Birth',
        value:
          currentUser.birthday && currentUser.birthday !== 'NaN'
            ? format(fromUnixTime(currentUser.birthday), 'yyyy-MM-dd')
            : format(new Date(), 'yyyy-MM-dd'),
        type: 'date',
        name: 'birthday',
      },
      {
        label: "Parent's Name",
        value: currentUser.parent_name || '',
        type: 'input',
        name: 'parent_name',
      },
      {
        label: "Parent's Contact",
        value: currentUser.parent_contact || '',
        type: 'input',
        name: 'parent_contact',
      },
    ];

    console.log(teacherArray, 'start');

    if (user.role_id !== '1') {
      teacherArray = dataArray.slice(0, -2);
    }

    console.log(teacherArray);

    setFormDataArray(user.role_id === '1' ? dataArray : teacherArray);
  }, [user, history]);

  const getFormData = (values, image) => {
    console.log(values);
    console.log(image);

    const payload = {
      first_name: values.first_name,
      last_name: values.last_name,
      contact: user.contact,
      email: values.email,
      address: values.address,
      birthday: parse(values.birthday, 'yyyy-MM-dd', new Date()).getTime() / 1000,
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
  roleArray: getRoleArray(state),
});

export default connect(mapStateToProps)(EditProfileHOC);

EditProfileHOC.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
  user: PropTypes.instanceOf(Object).isRequired,
  clientId: PropTypes.number.isRequired,
  // clientUserId: PropTypes.number.isRequired,
  // userId: PropTypes.number.isRequired,
  // roleArray: PropTypes.instanceOf(Array).isRequired,
};
