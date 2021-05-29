import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import ReactIntlTelInput from 'react-intl-tel-input-v2';
import PropTypes from 'prop-types';
import './LoginDetailsSkeleton.scss';
import '../../Login/PhoneNo/PhoneNo.scss';
import '../../Login/Login.scss';
import 'intl-tel-input/build/css/intlTelInput.css';
import Button from 'react-bootstrap/Button';

export const LoginDetailsSkeleton = (props) => {
  const {
    image,
    heading,
    englishText,
    hindiText,
    value,
    setValue,
    isValid,
    setClick,
    isVerify,
    placeholder,
    password,
    forgotPlaceholder,
  } = props;

  // const [mobileNo, setMobileNo] = useState({ iso2: 'in', dialCode: '91', phone: '' });
  //  const [isValid, setValid] = useState(false);
  const [showPassword, setPasswordShown] = useState(true);
  const inputProps = {
    placeholder: 'Mobile Number',
  };

  const intlTelOpts = {
    preferredCountries: ['in'],
  };

  const togglePasswordVisibility = () => {
    setPasswordShown((prevState) => !prevState);
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
        {placeholder === 'Mobile number' ? (
          <div className='text-center mt-5 LoginDetailsSkeleton__phoneNoOnly LoginDetailsSkeleton__phoneNoInput'>
            <ReactIntlTelInput
              inputProps={inputProps}
              intlTelOpts={intlTelOpts}
              value={value}
              onChange={setValue}
            />
          </div>
        ) : (
          <div
            className='LoginDetailsSkeleton__phoneNoOnly LoginDetailsSkeleton__phoneNoInput'
            style={{ marginTop: '6rem' }}
          >
            <label className='has-float-label my-auto'>
              <input
                className='form-control'
                name='Mobile Number'
                type={
                  password
                    ? showPassword
                      ? 'password'
                      : 'text'
                    : placeholder === 'Mobile number'
                    ? 'number'
                    : 'text'
                }
                placeholder={placeholder}
                onChange={(event) => setValue(event.target.value)}
                value={value}
                ref={(input) => input && input.focus()}
              />
              <span>{placeholder}</span>
              {password &&
                (showPassword ? (
                  <i
                    className='PhoneNo__show'
                    onClick={togglePasswordVisibility}
                    onKeyDown={togglePasswordVisibility}
                    role='button'
                    tabIndex={0}
                  >
                    <VisibilityOffIcon />
                  </i>
                ) : (
                  <i
                    className='PhoneNo__show'
                    onClick={togglePasswordVisibility}
                    onKeyDown={togglePasswordVisibility}
                    role='button'
                    tabIndex={0}
                  >
                    <VisibilityIcon />
                  </i>
                ))}
            </label>
          </div>
        )}
      </div>
      <div className='d-flex justify-content-center LoginDetailsSkeleton__phoneNoInput'>
        <Button variant='loginPrimary' className='my-5 mx-4' onClick={() => setClick()}>
          {isVerify ? 'Verifying..' : 'Next'}
        </Button>
      </div>

      {isValid && (
        <small className='text-danger d-block text-center'>
          Please enter a valid {placeholder}
        </small>
      )}

      {placeholder === 'Password' && heading === 'Enter Password' && (
        <Row className='mx-auto justify-content-center' style={{ width: '90%' }}>
          <span
            className='PhoneNo__forgot p-1 text-center my-4'
            onClick={() => forgotPlaceholder()}
            onKeyDown={() => forgotPlaceholder()}
            role='button'
            tabIndex='-1'
            style={{
              fontFamily: 'Montserrat-Medium',
              fontSize: '14px',
              color: 'var(--primary-blue)',
            }}
          >
            Forgot {placeholder}?
          </span>
        </Row>
      )}
    </>
  );
};

LoginDetailsSkeleton.propTypes = {
  image: PropTypes.string.isRequired,
  englishText: PropTypes.string.isRequired,
  hindiText: PropTypes.string.isRequired,
  heading: PropTypes.string.isRequired,
  value: PropTypes.instanceOf(Object).isRequired,
  setValue: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  isValid: PropTypes.bool.isRequired,
  setClick: PropTypes.func.isRequired,
  isVerify: PropTypes.bool.isRequired,
  password: PropTypes.bool.isRequired,
  forgotPlaceholder: PropTypes.func,
};

LoginDetailsSkeleton.defaultProps = {
  forgotPlaceholder: () => {},
};
