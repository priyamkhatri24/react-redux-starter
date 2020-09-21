import React, { useState, useEffect } from 'react';
import './Enquiry.scss';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import EnquiryDetails from './EnquiryDetails/EnquiryDetails';
import avatarImage from '../../../../assets/images/avatarImage.jpg';
import { ChatDots } from '../../../Common';
import { useTimeout, get, apiValidation } from '../../../../Utilities';
import { getClientUserId } from '../../../../redux/reducers/clientUserId.reducer';

const Enquiry = (props) => {
  const { clientUserId } = props;
  const [radioOption, setOptions] = useState('initialForm');
  const [waitingDots, setWaitingDotsTime] = useState(true);
  const [waitingDotsAgain, setWaitingDotsTimeAgain] = useState(true);
  const [CRMQuestions, setCRMQuestions] = useState([]);
  useTimeout(() => setWaitingDotsTimeAgain(false), 2000);

  useEffect(() => {
    console.log(clientUserId);
    get(1622, '/getCRMQuestions') // change to clientBranding
      .then((res) => {
        const result = apiValidation(res);
        setWaitingDotsTime(false);
        setCRMQuestions(result);
      })
      .catch((e) => console.error(e));
  }, [clientUserId]);

  return (
    <div className='Enquiry'>
      <Col>
        <Row className='align-self-center justify-content-center py-3 mb-5 Enquiry__folded'>
          <span>Today</span>
        </Row>
        <div className='mt-5'>
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
              <Row className='mb-3 ml-1 Enquiry__blurb '>
                <img
                  src={avatarImage}
                  width='24'
                  height='24'
                  alt='avatar'
                  className='rounded-circle m-1'
                />

                <div className='ml-2 Enquiry__chatBox w-75 p-3'>
                  <p>Do you want to know more about this coaching?</p>
                  <p className='text-center'> or</p>
                  <p>Do you want to fill admission form?</p>
                </div>
              </Row>

              <Row className='mb-3 ml-1 Enquiry__blurb'>
                {waitingDotsAgain && (
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
              {!waitingDotsAgain && (
                <>
                  <Row className='mb-5 ml-1 Enquiry__blurb Enquiry__blurbDelay'>
                    <img
                      src={avatarImage}
                      width='24'
                      height='24'
                      alt='avatar'
                      className='rounded-circle m-1'
                    />

                    <div className='ml-2 Enquiry__chatBox w-75 p-3'>
                      <p className='Enquiry__hinText'>
                        <span> क्या आप इस कोचिंग के बारे में अधिक जानकारी चाहते हैं ?</span>
                      </p>
                      <p className='text-center Enquiry__hinText'>
                        <span>या</span>
                      </p>
                      <p className='Enquiry__hinText'>
                        <span>आप admission form भरना चाहते हैं?</span>
                      </p>
                    </div>
                  </Row>
                  {radioOption === 'initialForm' && (
                    <Row className='Enquiry__rightBlurb'>
                      <div className='ml-auto mr-3 '>
                        <Col className='Enquiry__formContainer p-0'>
                          <p className='text-center Enquiry__formHeading pt-3 pb-2 px-0 m-0'>
                            Select Your Reply
                          </p>
                          <Form className='Enquiry__form mt-3 mx-2 '>
                            <div className='mb-3'>
                              <Form.Check
                                type='radio'
                                id='EnquiryInformation'
                                label='Information / जानकारी'
                                value='information'
                                name='enquiry'
                                onChange={(e) => setOptions(e.target.value)}
                              />

                              <Form.Check
                                type='radio'
                                label='Admission Form'
                                id='EnquiryInformation'
                                value='admissionForm'
                                name='enquiry'
                                onChange={(e) => setOptions(e.target.value)}
                              />
                            </div>
                          </Form>
                        </Col>
                      </div>
                    </Row>
                  )}
                </>
              )}

              {radioOption === 'admissionForm' && <Redirect push to='/admissionform' />}

              {radioOption === 'information' && <EnquiryDetails questions={CRMQuestions} />}
            </>
          )}
        </div>
      </Col>
    </div>
  );
};

const mapStateToProps = (state) => ({
  clientUserId: getClientUserId(state),
});

export default connect(mapStateToProps)(Enquiry);
