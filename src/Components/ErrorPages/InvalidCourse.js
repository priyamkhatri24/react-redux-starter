import React from 'react';
import { history } from '../../Routing';
import ErrorSkeleton from './ErrorSkeleton';

const ErrorCode = () => {
  return (
    <ErrorSkeleton
      heading=':/'
      subHeading='Oops!'
      errorText='The course you are looking for has been removed by admin.'
      additionalInfo=' Please connect with your institute for more details.'
      history={history}
    />
  );
};

export default ErrorCode;
