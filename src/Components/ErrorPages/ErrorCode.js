import React from 'react';
import { history } from '../../Routing';
import ErrorSkeleton from './ErrorSkeleton';

const ErrorCode = () => {
  return (
    <ErrorSkeleton
      heading=':/'
      subHeading='Oops!'
      errorText='Something went wrong.'
      additionalInfo=' Please check your internet connection and try again.'
      history={history}
    />
  );
};

export default ErrorCode;
