import React, { useState, useEffect, useRef } from 'react';
import '../Enquiry.scss';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CheckIcon from '@material-ui/icons/Check';
import Button from 'react-bootstrap/Button';
import DescriptionIcon from '@material-ui/icons/Description';
import { history } from '../../../../../Routing';
import { ChatDots } from '../../../../Common';
import { useTimeout, EmailRegExp } from '../../../../../Utilities';
import avatarImage from '../../../../../assets/images/avatarImage.jpg';

const EnquiryDetails = () => {
  const [waitingDots, setWaitingDotsTme] = useState(true);
  const [showInput, setShowInput] = useState(true);
  const [emailDots, setEmailDots] = useState(true);
  const [name, showName] = useState(false);
  const [isValid, setValid] = useState(false);
  const [newEnquiryDetails, setEnquiryDetails] = useState({
    name: '',
    emailAddress: '',
  });

  const inputEl = useRef(null);
  const focusedBlurb = useRef(null);

  useEffect(() => {
    if (!waitingDots && showInput) {
      inputEl.current.focus();
    } else if (!waitingDots && !showInput) {
      focusedBlurb.current.focus();
    }
  });

  useTimeout(() => setWaitingDotsTme(false), 3000);

  const setFormValue = (param, value) => {
    if (param === 'name') {
      setEnquiryDetails((prevstate) => {
        return { ...prevstate, name: value };
      });
      console.log(value);
    } else if (param === 'email') {
      setEnquiryDetails((prevstate) => {
        return { ...prevstate, emailAddress: value };
      });
    }
  };

  const nameSubmitted = () => {
    showName(true);
    setTimeout(() => setEmailDots(false), 3000);
  };

  const emailSubmitted = () => {
    if (newEnquiryDetails.emailAddress.match(EmailRegExp)) {
      setValid(false);
      setShowInput(false);

      console.log(newEnquiryDetails);
    } else {
      setValid(true);
    }
  };

  const goToAdmission = () => {
    history.push('./dashboard');
  };

  return (
    <>
      <Row className='Enquiry__rightBlurb mb-3'>
        <div className='ml-auto mr-3 '>
          <Col className='p-0'>
            <p className='text-center Enquiry__rightInfo pt-3 px-2 m-0 rounded-top'>Information</p>
            <p className='text-center Enquiry__rightInfo pb-3 px-2 m-0 rounded-bottom'>जानकारी</p>
          </Col>
        </div>
      </Row>

      {waitingDots && <ChatDots />}

      {!waitingDots && (
        <>
          <Row className='mb-3 ml-1 Enquiry__blurb'>
            <img
              src={avatarImage}
              width='30'
              height='30'
              alt='avatar'
              className='rounded-circle m-1'
            />

            <div className='ml-2 Enquiry__chatBox w-75 p-3'>
              <p>Please tell us your name ?</p>
              <p className='Enquiry__hinText'>
                <span>कृपया हमें अपना नाम बताएं ?</span>
              </p>
            </div>
          </Row>

          {name && (
            <>
              <Row className='Enquiry__rightBlurb mb-3'>
                <div className='ml-auto mr-3 '>
                  <Col className='p-0'>
                    <p className='text-center Enquiry__rightInfo p-3 m-0 rounded'>
                      {newEnquiryDetails.name}
                    </p>
                  </Col>
                </div>
              </Row>
              {emailDots && <ChatDots />}

              {!emailDots && (
                <Row className='mb-3 ml-1 Enquiry__blurb'>
                  <img
                    src={avatarImage}
                    width='30'
                    height='30'
                    alt='avatar'
                    className='rounded-circle m-1'
                  />

                  <div className='ml-2 Enquiry__chatBox w-75 p-3'>
                    <p>
                      Hi
                      {newEnquiryDetails.name}!
                    </p>
                    <p> Please provide your email address.</p>
                    <p className='Enquiry__hinText'>
                      <span>कृपया हमें अपना ई-मेल पता उपलब्ध कराएं</span>
                    </p>
                  </div>
                </Row>
              )}
            </>
          )}

          {showInput && (
            <Row className='text-center'>
              <Col xs={9}>
                <input
                  ref={inputEl}
                  className='form-control'
                  name={name ? 'email' : 'Name'}
                  type='text'
                  placeholder={name ? 'Email Address' : 'Name'}
                  onChange={
                    name
                      ? (event) => setFormValue('email', event.target.value)
                      : (event) => setFormValue('name', event.target.value)
                  }
                  value={name ? newEnquiryDetails.emailAddress : newEnquiryDetails.name}
                />
              </Col>
              <Col xs={3}>
                <Button
                  variant='primary'
                  onClick={name ? () => emailSubmitted() : () => nameSubmitted()}
                >
                  <CheckIcon />
                </Button>
              </Col>

              {isValid && (
                <small className='text-danger d-block'>Please enter a valid Email Address</small>
              )}
            </Row>
          )}

          {!showInput && (
            <>
              <Row className='Enquiry__rightBlurb mb-3'>
                <div className='ml-auto mr-3 '>
                  <Col className='p-0'>
                    <p className='text-center Enquiry__rightInfo p-3 m-0 rounded'>
                      {newEnquiryDetails.emailAddress}
                    </p>
                  </Col>
                </div>
              </Row>

              <Row className='mb-3 ml-1 Enquiry__blurb'>
                <img
                  src={avatarImage}
                  width='30'
                  height='30'
                  alt='avatar'
                  className='rounded-circle m-1'
                />

                <div className='ml-2 Enquiry__chatBox w-75 p-3'>
                  <p> Thank you for your interest! We will contact you shortly.</p>
                  <p className='Enquiry__hinText'>
                    <span> आपकी रूचि के लिए धन्यवाद। हम आपसे शीघ्र ही संपर्क करेंगे।</span>
                  </p>
                </div>
              </Row>

              <Row className='mb-3 ml-1 Enquiry__blurb'>
                <img
                  src={avatarImage}
                  width='30'
                  height='30'
                  alt='avatar'
                  className='rounded-circle m-1'
                />

                <div className='ml-2 Enquiry__chatBox w-75 p-3'>
                  <p>
                    If you have already been contacted. Please move forward and fill our admission
                    form.
                  </p>
                  <p className='Enquiry__hinText'>
                    <span>
                      यदि आपसे संपर्क किया जा चुका है। कृपया आगे बढ़े और admission form भरे।
                    </span>
                  </p>
                </div>
              </Row>
              <Row className='Enquiry__rightBlurb mb-3'>
                <div className='ml-auto mr-3 '>
                  <Col className='p-0'>
                    <p className='text-center Enquiry__admissionForm p-3 m-0 rounded'>
                      <DescriptionIcon />
                      <span
                        ref={focusedBlurb}
                        tabIndex='-1'
                        onClick={() => goToAdmission()}
                        onKeyDown={() => goToAdmission()}
                      >
                        Admission Form
                      </span>
                    </p>
                  </Col>
                </div>
              </Row>
            </>
          )}
        </>
      )}
    </>
  );
};

export default EnquiryDetails;
