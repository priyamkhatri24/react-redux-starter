import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import '../Enquiry.scss';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DescriptionIcon from '@material-ui/icons/Description';
import avatarImage from '../../../../../assets/images/avatarImage.jpg';
import EnquiryTemplate from '../../EnquiryTemplate/EnquiryTemplate';

const EnquiryDetails = (props) => {
  const { questions } = props;
  const [showLastElement, setShowLastElement] = useState(false);
  const [newEnquiryDetails, setEnquiryDetails] = useState({});
  /** since we are setting visiblity of first element to true */
  const [visibleArrayLength, setLength] = useState(1);
  /** ******************************************************** */
  const [goToAdmissionForm, setAdmissionForm] = useState(false);
  const [isVisibleArray, setVisible] = useState([]);
  const focusedBlurb = useRef(null);

  useEffect(() => {
    questions.map((elem) => {
      return (elem.isVisible = false);
    });
    questions[0].isVisible = true;
    setVisible(questions);
  }, [questions]);

  useEffect(() => {
    if (showLastElement) {
      focusedBlurb.current.scrollIntoView({ behaviour: 'smooth' });
    }
  }, [showLastElement]);

  const getFormData = (data, type) => {
    setEnquiryDetails((prevstate) => {
      return { ...prevstate, [type]: data };
    });
    if (visibleArrayLength < isVisibleArray.length) {
      const newArr = [...isVisibleArray];
      newArr[visibleArrayLength].isVisible = true;
      setVisible(newArr);
      setLength((e) => e + 1);
    } else {
      // condition for last element
      setShowLastElement(true);
    }
  };

  // const setFormValue = (param, value) => {
  //   if (param === 'name') {
  //     setEnquiryDetails((prevstate) => {
  //       return { ...prevstate, name: value };
  //     });
  //     console.log(value);
  //   } else if (param === 'email') {
  //     setEnquiryDetails((prevstate) => {
  //       return { ...prevstate, emailAddress: value };
  //     });
  //   }
  // };

  // const nameSubmitted = () => {
  //   showName(true);
  //   setTimeout(() => setEmailDots(false), 3000);
  // };

  // const emailSubmitted = () => {
  //   if (newEnquiryDetails.emailAddress.match(EmailRegExp)) {
  //     setValid(false);
  //     setShowInput(false);

  //     console.log(newEnquiryDetails);
  //   } else {
  //     setValid(true);
  //   }
  // };

  const goToAdmission = () => {
    setAdmissionForm(true);
  };

  return (
    <>
      {goToAdmissionForm ? <Redirect push to={{ pathname: '/admissionform' }} /> : null}
      <Row className='Enquiry__rightBlurb mb-3'>
        <div className='ml-auto mr-3 '>
          <Col className='p-0'>
            <p className='text-center Enquiry__rightInfo pt-3 px-2 m-0 rounded-top'>Information</p>
            <p className='text-center Enquiry__rightInfo pb-3 px-2 m-0 rounded-bottom'>जानकारी</p>
          </Col>
        </div>
      </Row>

      {isVisibleArray
        .filter((elem) => elem.isVisible === true)
        .map((elem) => (
          <EnquiryTemplate
            text={elem}
            getData={getFormData}
            type={elem.placeholder}
            details={newEnquiryDetails}
            key={elem.crm_question_id}
          />
        ))}

      {showLastElement && (
        <>
          <Row className='mb-3 ml-1 Enquiry__blurb'>
            <img
              src={avatarImage}
              width='24'
              height='24'
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
              width='24'
              height='24'
              alt='avatar'
              className='rounded-circle m-1'
            />

            <div className='ml-2 Enquiry__chatBox w-75 p-3'>
              <p>
                If you have already been contacted. Please move forward and fill our admission form.
              </p>
              <p className='Enquiry__hinText'>
                <span>यदि आपसे संपर्क किया जा चुका है। कृपया आगे बढ़े और admission form भरे।</span>
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
                    role='button'
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
  );
};

export default EnquiryDetails;

EnquiryDetails.propTypes = {
  questions: PropTypes.instanceOf(Array).isRequired,
};
