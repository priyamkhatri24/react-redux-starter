import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { ChatDots } from '../../../Common';
import { useTimeout, EmailRegExp, onlyAlphaRegExp } from '../../../../Utilities';
import avatarImage from '../../../../assets/images/avatarImage.jpg';
import './EnquiryTemplate.scss';
import check from '../../../../assets/images/checkMark.svg';

const EnquiryTemplate = (props) => {
  const { text, getData, type, details } = props;

  const [waitingDots, setWaitingDotsTime] = useState(true);
  const [isValid, setValid] = useState(false);
  const [inputData, setData] = useState('');
  const [showValue, setValue] = useState(false);
  const inputEl = useRef(null);

  useTimeout(() => setWaitingDotsTime(false), 1000);

  useEffect(() => {
    if (!waitingDots && !showValue) {
      inputEl.current.scrollIntoView();
    }
  });

  useEffect(() => {
    if (text.question_type === 'objective') {
      text.merged = [];
      for (let i = 0; i < text.english_options.length; i++) {
        text.merged[i] = text.hindi_options[i]
          ? `${text.english_options[i].option_text}/${text.hindi_options[i].option_text}`
          : text.english_options[i].option_text;
      }
    }

    if (text.response) {
      setData(text.response);
      setValue(true);
      getData(inputData, type);
    }
  }, [
    getData,
    inputData,
    text.english_options,
    text.hindi_options,
    text.merged,
    text.question_type,
    text.response,
    type,
  ]);

  const submitData = () => {
    if (type === 'email') {
      if (inputData.match(EmailRegExp)) {
        setValid(false);
        getData(inputData, type);
        setValue(true);
      } else {
        setValid(true);
      }
    } else if (inputData) {
      setValid(false);
      getData(inputData, type);
      setValue(true);
    } else {
      setValid(true);
    }
  };

  const setFormData = (e) => {
    if ((type === 'name' && e === '') || onlyAlphaRegExp.test(e)) {
      setData(e);
    } else {
      setData(e);
    }
  };

  const submitOption = (e) => {
    getData(e, type);
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
              {details.name && type !== 'name' && <p>Hi {details.name}!</p>}
              <p>{text.english_text}</p>

              <p className='Enquiry__hinText'>
                <span>{text.hindi_text}</span>
              </p>
            </div>
          </Row>

          {!showValue && text.question_type === 'subjective' && (
            <Row className='text-center EnquiryTemplate__inputRow'>
              <Col xs={10} className='EnquiryTemplate__input pr-0'>
                <input
                  ref={inputEl}
                  name={type}
                  type='text'
                  placeholder={type}
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
                  Please enter a valid {type}
                </small>
              )}
            </Row>
          )}

          {!showValue && text.question_type === 'objective' && (
            <Row className='Enquiry__rightBlurb mb-3'>
              <div className='ml-auto mr-3 '>
                <Col className='Enquiry__formContainer p-0'>
                  <p className='text-center Enquiry__formHeading pt-3 pb-2 px-2 m-0'>
                    Select Your Reply
                  </p>
                  <Form className='Enquiry__form my-3 mx-2 '>
                    <div className='mb-3'>
                      {text.merged.map((elem) => {
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

EnquiryTemplate.propTypes = {
  text: PropTypes.shape({
    question_type: PropTypes.string.isRequired,
    merged: PropTypes.instanceOf(Array),
    english_options: PropTypes.instanceOf(Array),
    hindi_options: PropTypes.instanceOf(Array),
    response: PropTypes.string,
    english_text: PropTypes.string,
    hindi_text: PropTypes.string,
  }),

  getData: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  details: PropTypes.instanceOf(Object),
};

EnquiryTemplate.defaultProps = {
  text: {
    merged: undefined,
    english_options: [],
    hindi_options: [],
    english_text: '',
    hindi_text: '',
    response: null,
  },
  details: {},
};
