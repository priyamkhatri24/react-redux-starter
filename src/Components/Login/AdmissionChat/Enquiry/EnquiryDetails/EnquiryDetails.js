import React, { useState, useEffect, useRef } from 'react';
import '../Enquiry.scss';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DescriptionIcon from '@material-ui/icons/Description';
import { history } from '../../../../../Routing';
import avatarImage from '../../../../../assets/images/avatarImage.jpg';
import EnquiryTemplate from '../../EnquiryTemplate/EnquiryTemplate';

const EnquiryDetails = (props) => {
  const [showLastElement, setShowLastElement] = useState(false);
  const [newEnquiryDetails, setEnquiryDetails] = useState({});
  const [visibleArrayLength, setLength] = useState(1); // since we are setting visiblity of first element to true
  const [isVisibleArray, setVisible] = useState([]);

  const focusedBlurb = useRef(null);

  // const textArray = {
  //   result: [
  //     {
  //       crm_question_id: 1,
  //       english_text: 'Please tell us your name ?',
  //       hindi_text: 'कृपया हमें अपना नाम बताएं ?',
  //       question_type: 'subjective',
  //       english_options: [],
  //       hindi_options: [],
  //       crm_question_response_id: null,
  //       crm_question_crm_question_id: null,
  //       client_user_client_user_id: null,
  //       response: '',
  //       placeholder: 'name',
  //     },
  //     {
  //       crm_question_id: 2,
  //       english_text: ' Please provide your email address.',
  //       hindi_text: 'कृपया हमें अपना ई-मेल पता उपलब्ध कराएं',
  //       question_type: 'subjective',
  //       english_options: [],
  //       hindi_options: [],
  //       crm_question_response_id: null,
  //       crm_question_crm_question_id: null,
  //       client_user_client_user_id: null,
  //       response: '',
  //       placeholder: 'email',
  //     },
  //     {
  //       crm_question_id: 3,
  //       english_text: 'Hello, how are you feeling?',
  //       hindi_text: 'स्वागत है आपका',
  //       question_type: 'subjective',
  //       english_options: [],
  //       hindi_options: [],
  //       crm_question_response_id: null,
  //       crm_question_crm_question_id: null,
  //       client_user_client_user_id: null,
  //       placeholder: 'Hello',
  //       response: 'abcdef',
  //     },
  //     {
  //       crm_question_id: 4,
  //       english_text: 'Hello,A for?',
  //       hindi_text: 'स्वागत है आपका',
  //       question_type: 'objective',
  //       english_options: [
  //         {
  //           option_text: 'A',
  //           order: 1,
  //         },
  //         {
  //           option_text: 'B',
  //           order: 2,
  //         },
  //         {
  //           option_text: 'C',
  //           order: 3,
  //         },
  //         {
  //           option_text: 'D',
  //           order: 4,
  //         },
  //       ],
  //       hindi_options: [
  //         {
  //           option_text: 'A',
  //           order: 1,
  //         },
  //         {
  //           option_text: 'B',
  //           order: 2,
  //         },
  //         {
  //           option_text: 'C',
  //           order: 3,
  //         },
  //         {
  //           option_text: 'D',
  //           order: 4,
  //         },
  //       ],
  //       crm_question_response_id: null,
  //       crm_question_crm_question_id: null,
  //       client_user_client_user_id: null,
  //       placeholder: 'a for',
  //     },
  //   ],
  // };

  useEffect(() => {
    props.questions.map((elem) => {
      return (elem['isVisible'] = false);
    });
    props.questions[0].isVisible = true;
    setVisible(props.questions);
  }, []);

  useEffect(() => {
    if (showLastElement) {
      focusedBlurb.current.scrollIntoView({ behaviour: 'smooth' });
    }
    setTimeout(() => {
      console.log(isVisibleArray);
    }, 2000);
  }, [showLastElement]);

  const getFormData = (data, type) => {
    setEnquiryDetails((prevstate) => {
      return { ...prevstate, [type]: data };
    });
    if (visibleArrayLength < isVisibleArray.length) {
      let newArr = [...isVisibleArray];
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
    history.push('./admissionform');
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
