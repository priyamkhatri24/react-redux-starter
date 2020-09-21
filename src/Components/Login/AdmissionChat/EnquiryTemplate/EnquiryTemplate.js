import React, { useState, useRef, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ChatDots } from '../../../Common';
import { useTimeout, EmailRegExp, onlyAlphaRegExp } from '../../../../Utilities';
import avatarImage from '../../../../assets/images/avatarImage.jpg';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './EnquiryTemplate.scss';
import check from '../../../../assets/images/checkMark.svg';

const EnquiryTemplate = (props) => {
  const [waitingDots, setWaitingDotsTime] = useState(true);
  const [isValid, setValid] = useState(false);
  const [inputData, setData] = useState('');
  const [showValue, setValue] = useState(false);

  useTimeout(() => setWaitingDotsTime(false), 1000);

  useEffect(() => {
    if (!waitingDots && !showValue) {
      inputEl.current.scrollIntoView();
    }
  });

  useEffect(() => {
    if (props.text.question_type === 'objective') {
      props.text['merged'] = [];
      for (let i = 0; i < props.text.english_options.length; i++) {
        props.text.merged[i] = props.text.hindi_options[i]
          ? props.text.english_options[i].option_text +
            '/' +
            props.text.hindi_options[i].option_text
          : props.text.english_options[i].option_text;
      }
    }

    if (props.text.response) {
      setData(props.text.response);
      setValue(true);
      props.getData(inputData, props.type);
    }
  }, []);

  const inputEl = useRef(null);

  const submitData = () => {
    if (props.type === 'email') {
      if (inputData.match(EmailRegExp)) {
        setValid(false);
        props.getData(inputData, props.type);
        setValue(true);
      } else {
        setValid(true);
      }
    } else {
      if (inputData) {
        setValid(false);
        props.getData(inputData, props.type);
        setValue(true);
      } else {
        setValid(true);
      }
    }
  };

  const setFormData = (e) => {
    if ((props.type === 'name' && e === '') || onlyAlphaRegExp.test(e)) {
      setData(e);
    } else {
      setData(e);
    }
  };

  const submitOption = (e) => {
    props.getData(e, props.type);
  };

  return (
    <>
      <Row className='mb-3 ml-1 Enquiry__blurb'>
        {waitingDots && (
          <>
            <img
              src={avatarImage}
              width='24'
              height='24'
              alt='avatar'
              className='rounded-circle m-1'
            />
            <ChatDots />
          </>
        )}
      </Row>
      {!waitingDots && (
        <>
          <Row className='mb-5 ml-1 Enquiry__blurb'>
            <img
              src={avatarImage}
              width='24'
              height='24'
              alt='avatar'
              className='rounded-circle m-1'
            />
            <div className='ml-2 Enquiry__chatBox w-75 p-3'>
              {props.details.name && props.type !== 'name' && <p>Hi {props.details.name}!</p>}
              <p>{props.text.english_text}</p>

              <p className='Enquiry__hinText'>
                <span>{props.text.hindi_text}</span>
              </p>
            </div>
          </Row>

          {!showValue && props.text.question_type === 'subjective' && (
            <Row className='text-center EnquiryTemplate__inputRow'>
              <Col xs={10} className='EnquiryTemplate__input pr-0'>
                <input
                  ref={inputEl}
                  name={props.type}
                  type='text'
                  placeholder={props.type}
                  onChange={(event) => setFormData(event.target.value)}
                  value={inputData}
                />
              </Col>
              <Col xs={2} className='p-0'>
                <Button variant='enquiryTemplate' onClick={() => submitData()}>
                  <img src={check} alt='check button' className='my-auto' />
                </Button>
              </Col>

              {isValid && (
                <small className='text-danger d-block text-center'>
                  Please enter a valid {props.type}
                </small>
              )}
            </Row>
          )}

          {!showValue && props.text.question_type === 'objective' && (
            <Row className='Enquiry__rightBlurb mb-3'>
              <div className='ml-auto mr-3 '>
                <Col className='Enquiry__formContainer p-0'>
                  <p className='text-center Enquiry__formHeading pt-3 pb-2 px-2 m-0'>
                    Select Your Reply
                  </p>
                  <Form className='Enquiry__form my-3 mx-2 '>
                    <div className='mb-3'>
                      {props.text.merged.map((elem) => {
                        return (
                          <Form.Check
                            type='radio'
                            id={elem}
                            label={elem}
                            value={elem}
                            name='ojective options'
                            onChange={(e) => submitOption(e.target.value)}
                            ref={inputEl}
                            key={elem}
                          />
                        );
                      })}
                    </div>
                  </Form>
                </Col>
              </div>
            </Row>
          )}

          {showValue && (
            <Row className='Enquiry__rightBlurb mb-3'>
              <div className='ml-auto mr-3 '>
                <Col className='p-0'>
                  <p className='text-center Enquiry__rightInfo p-3 m-0 rounded'>{inputData}</p>
                </Col>
              </div>
            </Row>
          )}
        </>
      )}
    </>
  );
};

export default EnquiryTemplate;
