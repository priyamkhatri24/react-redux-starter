import React, { useState } from 'react';
import './Enquiry.scss';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { Redirect } from 'react-router-dom';
import EnquiryDetails from './EnquiryDetails/EnquiryDetails';
import avatarImage from '../../../../assets/images/avatarImage.jpg';

const Enquiry = () => {
  const [radioOption, setOptions] = useState('initialForm');

  return (
    <div className='Enquiry'>
      <Col>
        <Row className='align-self-center justify-content-center pt-2 mb-3 Enquiry__folded'>
          <span>Today</span>
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
            <p>Do you want to know more about this coaching?</p>
            <p className='text-center'> or</p>
            <p>Do you want to fill admission form?</p>
          </div>
        </Row>
        <Row className='mb-5 ml-1 Enquiry__blurb Enquiry__blurbDelay'>
          <img
            src={avatarImage}
            width='30'
            height='30'
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

        {radioOption === 'admissionForm' && <Redirect push to='/admissionform' />}

        {radioOption === 'information' && <EnquiryDetails />}
      </Col>
    </div>
  );
};

export default Enquiry;
