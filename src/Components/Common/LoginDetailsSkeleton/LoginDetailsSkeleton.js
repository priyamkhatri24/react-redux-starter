import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ReactIntlTelInput from 'react-intl-tel-input-v2';
import PropTypes from 'prop-types';
import './LoginDetailsSkeleton.scss';
import '../../Login/Login.scss';
import 'intl-tel-input/build/css/intlTelInput.css';
import Button from 'react-bootstrap/Button';

export const LoginDetailsSkeleton = (props) => {
  const { image, heading, englishText, hindiText, value, setValue } = props;

  const inputProps = {
    placeholder: 'Mobile Number',
  };

  const intlTelOpts = {
    preferredCountries: ['in'],
  };

  return (
    <>
      <Row className='mx-2 mt-4'>
        <Col xs={7} className='align-self-end Login__signupHeading'>
          {heading}
        </Col>
        <Col xs={5}>
          <img src={image} alt='phone' width='120px' height='125px' />
        </Col>
      </Row>
      <div className='LoginDetailsSkeleton mx-2 mt-5'>
        <p className='mx-lg-5 mx-3 mt-lg-3 mb-0 LoginDetailsSkeleton__text'>{englishText}</p>
        <p className='mx-lg-5 mx-3 LoginDetailsSkeleton__text'>{hindiText}</p>
        <div className='text-center mt-4'>
          <ReactIntlTelInput
            inputProps={inputProps}
            intlTelOpts={intlTelOpts}
            value={value}
            onChange={setValue}
          />
        </div>
      </div>
      <div className='d-flex justify-content-center'>
        <Button variant='loginPrimary' className='my-4 mx-4'>
          Next
        </Button>
      </div>
    </>
  );
};

LoginDetailsSkeleton.propTypes = {
  image: PropTypes.string.isRequired,
  englishText: PropTypes.string.isRequired,
  hindiText: PropTypes.string.isRequired,
  heading: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
};
