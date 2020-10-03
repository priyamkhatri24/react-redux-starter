import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { phoneRegExp } from '../../../Utilities';
import './PhoneNo.scss';

const PhoneNo = (props) => {
  const [title, setTitle] = useState('');
  const [spinner, setSpinner] = useState(true);
  const [isValid, setValid] = useState(false);
  const [isFocused, setFocus] = useState(false);
  const [showPassword, setPasswordShown] = useState(true);

  const { placeholder, status, password, getData, forgotPlaceholder } = props;

  const setClick = () => {
    if (placeholder === 'Mobile number') {
      if (title.match(phoneRegExp)) {
        getData(title);
        setSpinner(false);
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

  const togglePasswordVisibility = () => {
    setPasswordShown((prevState) => !prevState);
  };

  return (
    <div className='text-center PhoneNo mt-5'>
      {placeholder === 'Mobile number' && (
        <div>
          <p className='mx-lg-5 mx-3 mt-3 mt-lg-5 PhoneNo__text PhoneNo__engText'>
            Please enter your mobile number to continue
          </p>
          <p className='mx-lg-5 mx-3 PhoneNo__text PhoneNo__hinText'>
            जारी रखने के लिए कृपया अपना मोबाइल नंबर दर्ज करें
          </p>
        </div>
      )}

      {placeholder === 'username' && (
        <div>
          <p className='mx-lg-5 mx-3 mt-3 mt-lg-5 PhoneNo__text PhoneNo__engText'>
            Enter username sent on your mobile number
          </p>
          <p className='mx-lg-5 mx-3 PhoneNo__text PhoneNo__hinText'>
            अपने मोबाइल नंबर पर भेजा गया username दर्ज करें
          </p>
        </div>
      )}

      {placeholder === 'Password' && (
        <div>
          {status === 'pending' && (
            <p className='mx-lg-5 mx-3 mt-3 mt-lg-5  PhoneNo__passText'>Create Password</p>
          )}
          {status === 'active' && <p className='mx-lg-5 mx-3  PhoneNo__passText'>Enter Password</p>}
        </div>
      )}

      <Row className='mx-auto PhoneNo__input mt-5'>
        <Col md={10} xs={10} className='p-0 my-auto'>
          {/* disabing eslint since adding htmlFor results in the input not applying the span */}
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
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
              onChange={(event) => setTitle(event.target.value)}
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
              value={title}
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
        </Col>
        <Col md={2} xs={2} className='p-0 my-auto'>
          {spinner ? (
            isFocused ? (
              <Button variant='dynamicOutline' size='sm' type='submit' onClick={() => setClick()}>
                <ChevronRightIcon />
              </Button>
            ) : (
              <Button variant='unfocusedOutline' size='sm' type='submit' onClick={() => setClick()}>
                <ChevronRightIcon />
              </Button>
            )
          ) : (
            <div className='spinner-border text-primary' role='status'>
              <span className='sr-only'>Loading...</span>
            </div>
          )}
        </Col>
      </Row>
      {(placeholder === 'username' || placeholder === 'Password') && (
        <Row className='mx-auto' style={{ width: '90%' }}>
          <span
            className='PhoneNo__forgot p-1'
            onClick={() => forgotPlaceholder()}
            onKeyDown={() => forgotPlaceholder()}
            role='button'
            tabIndex='-1'
          >
            Forgot {placeholder}?
          </span>
        </Row>
      )}

      {isValid && (
        <small className='text-danger d-block'>
          Please enter a valid
          <span>{placeholder}</span>
        </small>
      )}
    </div>
  );
};

export default PhoneNo;

PhoneNo.propTypes = {
  placeholder: PropTypes.string.isRequired,
  status: PropTypes.string,
  password: PropTypes.bool,
  getData: PropTypes.func.isRequired,
  forgotPlaceholder: PropTypes.func,
};

PhoneNo.defaultProps = {
  password: false,
  status: '',
  forgotPlaceholder: () => {},
};
