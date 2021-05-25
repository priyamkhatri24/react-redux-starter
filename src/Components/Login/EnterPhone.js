import React, { useState } from 'react';
import phoneNo from '../../assets/images/Login/phoneNo.svg';
import { LoginDetailsSkeleton } from '../Common';

const EnterPhone = () => {
  const [mobileNo, setMobileNo] = useState({ iso2: 'in', dialCode: '91', phone: '' });

  const onChange = (values) => setMobileNo(values);

  return (
    <>
      <LoginDetailsSkeleton
        heading="Let's start!"
        englishText='Please enter your mobile number'
        hindiText='कृपया अपना मोबाइल नंबर दर्ज करें'
        image={phoneNo}
        value={mobileNo}
        setValue={onChange}
      />
    </>
  );
};

export default EnterPhone;
