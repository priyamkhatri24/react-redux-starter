import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { phoneRegExp } from '../../../Utilities/regExp';
import './PhoneNo.scss';

const PhoneNo = (props) => {
  const [title, setTitle] = useState('');
  const [spinner, setSpinner] = useState(true);
  const [isValid, setValid] = useState(false);
  const setClick = () => {
    if (title.match(phoneRegExp)) {
      props.getPhoneNo(title);
      setSpinner(false);
      setValid(false);
    } else {
      setValid(true);
    }
  };

  return (
    <div className='text-center PhoneNo'>
      <p className='mx-lg-5 mx-3 mt-3 mt-lg-5 PhoneNo__text PhoneNo__engText'>
        Please enter your mobile number to continue
      </p>
      <p className='mx-lg-5 mx-3 PhoneNo__text PhoneNo__hinText'>
        जारी रखने के लिए कृपया अपना मोबाइल नंबर दर्ज करें
      </p>
      <Row className='mx-auto PhoneNo__input mt-5'>
        <Col md={10} xs={9} className='p-0'>
          <label className='form-group has-float-label' htmlFor='Mobile Number'>
            <input
              className='form-control'
              name='Mobile Number'
              type='number'
              placeholder='Mobile number'
              onChange={(event) => setTitle(event.target.value)}
            />
            <span>Mobile number</span>
          </label>
        </Col>
        <Col md={2} xs={3} className='p-0'>
          {spinner ? (
            <Button variant='primary' type='submit' onClick={() => setClick()}>
              Submit
            </Button>
          ) : (
            <div className='spinner-border text-primary' role='status'>
              <span className='sr-only'>Loading...</span>
            </div>
          )}
        </Col>
      </Row>
      {isValid && <small className='text-danger d-block'>Please enter a valid number</small>}
    </div>
  );
};

export default PhoneNo;
