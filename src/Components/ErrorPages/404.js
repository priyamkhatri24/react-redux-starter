import React from 'react';
import ErrorSkeleton from './ErrorSkeleton';

const FourZeroFour = () => {
  return (
    <ErrorSkeleton
      heading=':('
      subHeading='404'
      errorText="We're sorry, the page you requested could not be found."
      additionalInfo='Please go back to the previous page or contact us at info@ingeniumedu.com'
    />
  );
};

export default FourZeroFour;
