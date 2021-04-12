import React from 'react';
import PropTypes from 'prop-types';
import './ErrorPages.scss';

const ErrorSkeleton = (props) => {
  const { heading, subHeading, errorText, additionalInfo } = props;
  return (
    <div style={{ marginTop: '140px' }} className='mx-4'>
      <h1 className='ErrorPages__heading'>{heading}</h1>
      <h2 className='ErrorPages__subHeading mb-5'>{subHeading}</h2>
      <p className='ErrorPages__errorText'>{errorText}</p>
      <p className='ErrorPages__errorText'>{additionalInfo}</p>
    </div>
  );
};

export default ErrorSkeleton;

ErrorSkeleton.propTypes = {
  heading: PropTypes.string.isRequired,
  subHeading: PropTypes.string.isRequired,
  errorText: PropTypes.string.isRequired,
  additionalInfo: PropTypes.string.isRequired,
};
