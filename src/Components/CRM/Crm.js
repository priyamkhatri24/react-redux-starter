/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import PhoneIcon from '@material-ui/icons/Phone';
import avatarImage from '../../assets/images/user.svg';
import { PageHeader } from '../Common/PageHeader/PageHeader';
import { getClientId } from '../../redux/reducers/clientUserId.reducer';
import AdmissionStyle from '../Admissions/Admissions.style';
import { apiValidation, get } from '../../Utilities';

const CRM = (props) => {
  const { clientId, history } = props;
  const [inquiryArray, setInquiryArray] = useState([]);
  const [admissionFormArray, setAdmissionFormArray] = useState([]);
  const [questionsAdmission, setquestionsAdmission] = useState([]);

  useEffect(() => {
    console.log('useEffect');
    get({ client_id: clientId }, '/getInquiryAndAdmissionDetailsOfClient').then((res) => {
      const result = apiValidation(res);
      console.log(result);
      setInquiryArray(result.inquiry);
      setAdmissionFormArray(result.admission);
    });
  }, [clientId]);

  useEffect(() => {
    let newQuestionsAdmission = [];
    newQuestionsAdmission = admissionFormArray.map((elem) => {
      return elem.question_array;
    });
    setquestionsAdmission(newQuestionsAdmission);
  }, []);

  console.log(inquiryArray, 'aa');
  console.log(admissionFormArray, 'bb');
  console.log(questionsAdmission, 'cc');
  const goToDashboard = () => {
    history.push('/');
  };

  return (
    <div>
      <PageHeader title='CRM' search customBack handleBack={goToDashboard} />
      <Tabs
        defaultActiveKey='Enquiries'
        className='Profile__Tabs'
        justify
        style={{ marginTop: '4rem' }}
      >
        <Tab eventKey='Enquiries' title='Enquiries' style={{ marginTop: '2rem' }}>
          <div css={AdmissionStyle.UserCards}>
            {inquiryArray.map((inquiry) => {
              return (
                <Card css={AdmissionStyle.card} key={clientId} className=''>
                  <Row className=' m-0 px-2 my-auto'>
                    <Col xs={2} sm={1} style={{ paddingTop: '15px' }}>
                      <img
                        src={avatarImage}
                        alt='avatar'
                        height='38'
                        width='38'
                        css={AdmissionStyle.avatar}
                      />
                    </Col>
                    <Col xs={10} sm={11}>
                      <p css={AdmissionStyle.avatarHeading} className='mb-0 mt-2 ml-2'>
                        {`${inquiry.first_name} ${inquiry.last_name}`}
                      </p>
                      <p css={AdmissionStyle.avatarStatus}>
                        <PhoneIcon css={AdmissionStyle.onlineIcon} />
                        +91-{inquiry.contact}
                      </p>
                    </Col>
                  </Row>
                </Card>
              );
            })}
          </div>
        </Tab>
        <Tab eventKey='Admission Form' title='Admission Form' style={{ marginTop: '2rem' }}>
          <p>Admission Form</p>
        </Tab>
      </Tabs>
    </div>
  );
};

const mapStateToProps = (state) => ({
  clientId: getClientId(state),
});

export default connect(mapStateToProps)(CRM);

CRM.propTypes = {
  clientId: PropTypes.number.isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
};
