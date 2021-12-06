/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import PhoneIcon from '@material-ui/icons/Phone';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import avatarImage from '../../assets/images/user.svg';
import { PageHeader } from '../Common/PageHeader/PageHeader';
import BottomNavigation from '../Common/BottomNavigation/BottomNavigation';
import { getClientId } from '../../redux/reducers/clientUserId.reducer';
import AdmissionStyle from '../Admissions/Admissions.style';
import { apiValidation, get } from '../../Utilities';

const CRM = (props) => {
  const { clientId, history } = props;
  const [inquiryArray, setInquiryArray] = useState([]);
  const [admissionFormArray, setAdmissionFormArray] = useState([]);
  const [searchString, setSearchString] = useState('');

  useEffect(() => {
    get({ client_id: clientId }, '/getInquiryAndAdmissionDetailsOfClient').then((res) => {
      const result = apiValidation(res);
      console.log(result);
      setInquiryArray(result.inquiry);
      setAdmissionFormArray(result.admission);
    });
  }, [clientId]);

  useEffect(() => {
    get({ client_id: clientId }, '/getInquiryAndAdmissionDetailsOfClient').then((res) => {
      const result = apiValidation(res);
      console.log(result);
      const searchedArrayInquiry = result.inquiry.filter(
        (e) => e.first_name.toLowerCase().indexOf(searchString.toLowerCase()) > -1,
      );
      const searchedArrayAdmission = result.admission.filter(
        (e) => e.first_name.toLowerCase().indexOf(searchString.toLowerCase()) > -1,
      );
      setInquiryArray(searchedArrayInquiry);
      setAdmissionFormArray(searchedArrayAdmission);
    });
  }, [searchString, clientId]);

  const searchCRM = (search) => {
    setSearchString(search);
  };

  console.log(inquiryArray, 'aa');
  console.log(admissionFormArray, 'admissionArray');
  // console.log(questionsAdmission, 'cc');
  const goToDashboard = () => {
    history.push('/');
  };

  return (
    <div>
      <PageHeader
        title='CRM'
        search
        searchFilter={searchCRM}
        customBack
        handleBack={goToDashboard}
      />
      <Tabs
        defaultActiveKey='Enquiries'
        className='Profile__Tabs'
        justify
        style={{ marginTop: '4rem' }}
      >
        <Tab
          eventKey='Enquiries'
          title='Enquiries'
          style={{ marginTop: '2rem', marginBottom: '3.5rem' }}
        >
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
                    <Col xs={10} sm={11} style={{ paddingTop: '10px' }}>
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
        <Tab
          eventKey='Admission Form'
          title='Admission Form'
          style={{ marginTop: '2rem', marginBottom: '3.5rem' }}
        >
          <div css={AdmissionStyle.UserCards}>
            {admissionFormArray.map((e) => {
              return (
                <Accordion key={e.user_id}>
                  <Card css={AdmissionStyle.card}>
                    <Accordion.Toggle as='div' eventKey='0'>
                      <Row className=' m-0 px-2 my-auto'>
                        <Col xs={2} sm={1} style={{ paddingTop: '15px' }}>
                          <img
                            src={e.profile_image || avatarImage}
                            alt='avatar'
                            height='38'
                            width='38'
                            css={AdmissionStyle.avatar}
                          />
                        </Col>
                        <Col xs={10} sm={11} style={{ paddingTop: '10px' }}>
                          <p css={AdmissionStyle.avatarHeading} className='mb-0 mt-2 ml-2'>
                            {`${e.first_name} ${e.last_name}`}
                            <span className='mt-1' style={{ position: 'absolute', right: '2%' }}>
                              <ExpandMoreIcon />
                            </span>
                          </p>

                          <p css={AdmissionStyle.avatarStatus}>
                            <PhoneIcon css={AdmissionStyle.onlineIcon} />
                            +91-{e.contact}
                          </p>
                        </Col>
                      </Row>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey='0'>
                      <div className='mt-0 mx-3'>
                        {e.question_array.map((elem) => {
                          return (
                            <div style={{ marginLeft: '7%' }}>
                              {elem.response.length > 0 && (
                                <>
                                  <p
                                    style={{
                                      fontSize: '12px',
                                      marginBottom: '6px',
                                      fontWeight: '600',
                                    }}
                                  >
                                    {' '}
                                    {elem.question}{' '}
                                  </p>
                                  <p style={{ fontSize: '14px', marginBottom: '6px' }}>
                                    {' '}
                                    {elem.response}{' '}
                                  </p>
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </Accordion.Collapse>
                  </Card>
                </Accordion>
              );
            })}
          </div>
        </Tab>
      </Tabs>

      <BottomNavigation activeNav='crm' history={history} />
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
