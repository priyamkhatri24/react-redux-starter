import React from 'react';
import PropTypes from 'prop-types';
import './ErrorPages.scss';

const InvalidURL = (props) => {
  // const { history } = props;

  // const handleBack = () => history.push('/');

  return (
    <div style={{ marginTop: '140px' }} className='mx-4'>
      <h1 className='ErrorPages__heading'>:(</h1>
      <h2 className='ErrorPages__subHeading mb-5'>Invalid URL</h2>
      <p className='ErrorPages__errorText'>
        We&apos;re sorry, the url you requested is incorrect or could not be found.
      </p>
      <p className='ErrorPages__errorText'>For help, contact us at info@ingeniumedu.com</p>
    </div>
  );
};

export default InvalidURL;

// ErrorSkeleton.propTypes = {
//   history: PropTypes.instanceOf(Object).isRequired,
// };
