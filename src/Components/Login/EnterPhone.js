import React, { useState } from 'react';
import PropTypes from 'prop-types';
import phoneNo from '../../assets/images/Login/phoneNo.svg';
import { LoginDetailsSkeleton } from '../Common';
import { phoneRegExp } from '../../Utilities';

const EnterPhone = (props) => {
  const { getData, placeholder } = props;

  const [mobileNo, setMobileNo] = useState({ iso2: 'in', dialCode: '91', phone: '' });
  const [verifying, setVerifying] = useState(false);
  const [isValid, setValid] = useState(false);
  const [title, setTitle] = useState('');

  const onChange = (values) => setMobileNo(values);

  const setClick = () => {
    if (placeholder === 'Mobile number') {
      if (mobileNo.dialCode !== '91' || mobileNo.phone.match(phoneRegExp)) {
        getData(mobileNo.phone, mobileNo.dialCode);
        setVerifying(true);
        setValid(false);
        setTitle('');
      } else {
        setValid(true);
      }
    } else if (placeholder === 'username' || placeholder === 'Password') {
      getData(title);
      setTitle('');
    }
  };

  return (
    <>
      <LoginDetailsSkeleton
        heading="Let's start!"
        englishText='Please enter your mobile number'
        hindiText='कृपया अपना मोबाइल नंबर दर्ज करें'
        image={phoneNo}
        value={mobileNo}
        setValue={onChange}
        isValid={isValid}
        setClick={setClick}
        isVerify={verifying}
        placeholder={placeholder}
      />
    </>
  );
};

export default EnterPhone;

EnterPhone.propTypes = {
  getData: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
};
