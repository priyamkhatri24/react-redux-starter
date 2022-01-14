/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import PhoneIcon from '@material-ui/icons/Phone';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TuneIcon from '@material-ui/icons/Tune';
import avatarImage from '../../assets/images/user.svg';
import { PageHeader } from '../Common/PageHeader/PageHeader';
import BottomNavigation from '../Common/BottomNavigation/BottomNavigation';
import { getClientId } from '../../redux/reducers/clientUserId.reducer';
import AdmissionStyle from '../Admissions/Admissions.style';
import { apiValidation, get } from '../../Utilities';
import Enquiry from '../Login/AdmissionChat/Enquiry/Enquiry';

const CRM = (props) => {
  const { clientId, history } = props;
  const [inquiryArray, setInquiryArray] = useState([]);
  const [admissionFormArray, setAdmissionFormArray] = useState([]);
  const [searchString, setSearchString] = useState('');
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('date');

  const infiniteScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight
    ) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', infiniteScroll);

    return () => window.removeEventListener('scroll', infiniteScroll);
  }, []);

  useEffect(() => {
    const payload = {
      client_id: clientId,
      page,
      sort_by: sortBy,
    };
    get(payload, '/getInquiriesOfClient').then((res) => {
      const result = apiValidation(res);
      const result2 = [...inquiryArray, ...result];
      console.log(result);
      setInquiryArray(result2);
    });
  }, [clientId, page, sortBy]);

  useEffect(() => {
    const payload = {
      client_id: clientId,
      page,
      sort_by: sortBy,
    };
    get(payload, '/getAdmissionsOfClient').then((res) => {
      const result = apiValidation(res);
      const result2 = [...admissionFormArray, ...result];
      console.log(result);
      setAdmissionFormArray(result2);
    });
  }, [clientId, page, sortBy]);

  useEffect(() => {
    const timer = setTimeout(() => {
      get({ client_id: clientId }, '/getInquiryAndAdmissionDetailsOfClient').then((res) => {
        const result = apiValidation(res);
        console.log(result);
        const searchedArrayInquiry = result.inquiry_object['Date wise'].filter(
          (e) => e.first_name.toLowerCase().indexOf(searchString.toLowerCase()) > -1,
        );
        const searchedArrayAdmission = result.admission_object['Date wise'].filter(
          (e) => e.first_name.toLowerCase().indexOf(searchString.toLowerCase()) > -1,
        );
        setInquiryArray(searchedArrayInquiry);
        setAdmissionFormArray(searchedArrayAdmission);
      });
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchString, clientId]);

  // SEARCH API INQUIRY 
  // useEffect(() => {
  //   let timer;
  //   if (searchString) {
  //     timer = setTimeout(() => {
  //       const payload = {
  //         client_id: clientId,
  //         page,
  //         keyword: searchString,
  //       };
  //       get(payload, '/searchInquiriesOfClient').then((res) => {
  //         const result = apiValidation(res);
  //         console.log(result);
  //         setInquiryArray(result);
  //       });
  //     }, 500);
  //   } else {
  //     const payload = {
  //       client_id: clientId,
  //       page,
  //       sort_by: sortBy,
  //     };
  //     get(payload, '/getInquiriesOfClient').then((res) => {
  //       const result = apiValidation(res);
  //       console.log(result);
  //       setInquiryArray(result);
  //     });
  //   }
  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, [searchString, clientId]);

  // SEARCH API ADDMISSION
  // useEffect(() => {
  //   let timer;
  //   if (searchString) {
  //     timer = setTimeout(() => {
  //       const payload = {
  //         client_id: clientId,
  //         page,
  //         keyword: searchString,
  //       };
  //       get(payload, '/searchAdmissionsOfClient').then((res) => {
  //         const result = apiValidation(res);
  //         console.log(result);
  //         setAdmissionFormArray(result);
  //       });
  //     }, 500);
  //   } else {
  //     const payload = {
  //       client_id: clientId,
  //       page,
  //       sort_by: sortBy, 
  //     };
  //     get(payload, '/getAdmissionsOfClient').then((res) => {
  //       const result = apiValidation(res);
  //       console.log(result);
  //       setAdmissionFormArray(result);
  //     });
  //   }
  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, [searchString, clientId]);

  const filterResult = (how) => {
    if (how === 'alphabetically') {
      setPage(1);
      setInquiryArray([]);
      setAdmissionFormArray([]);
      setSortBy('name');
    } else {
      setPage(1);
      setInquiryArray([]);
      setAdmissionFormArray([]);
      setSortBy('date');
    }
    setOpenFilterModal(false);
  };

  const searchCRM = (search) => {
    setSearchString(search);
  };

  const goToDashboard = () => {
    history.push('/');
  };

  const getReadableDate = (stamp) => {
    return new Date(stamp * 1000).toString().split(' ').slice(1, 5).join(' ');
  };

  return (
    <div>
      <PageHeader
        title='CRM'
        search
        filter
        searchFilter={searchCRM}
        triggerFilters={() => setOpenFilterModal(true)}
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
          style={{ marginTop: '2rem', marginBottom: '1rem' }}
        >
          <div css={AdmissionStyle.UserCards}>
            {inquiryArray.map((inquiry) => {
                return (
                  <Card
                    css={AdmissionStyle.card}
                    key={inquiry.user_id + inquiry.first_name}
                    className=''
                  >
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
                        <p className='mb-0' css={AdmissionStyle.avatarStatus}>
                          <PhoneIcon css={AdmissionStyle.onlineIcon} />
                          +91-{inquiry.contact}
                        </p>
                        <p
                          css={AdmissionStyle.avatarStatus}
                          className='mb-2 ml-2'
                          style={{ fontFamily: 'Montserrat-Regular' }}
                        >
                          Signup time: {getReadableDate(inquiry.signup_time)}
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
          style={{ marginTop: '2rem', marginBottom: '1rem' }}
        >
          <div css={AdmissionStyle.UserCards}>
            {admissionFormArray.map((e) => {
              return (
                <Accordion key={e.user_id + e.first_name}>
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

                          <p className='mb-0' css={AdmissionStyle.avatarStatus}>
                            <PhoneIcon css={AdmissionStyle.onlineIcon} />
                            +91-{e.contact}
                          </p>
                          <p
                            css={AdmissionStyle.avatarStatus}
                            className='mb-2 ml-2'
                            style={{ fontFamily: 'Montserrat-Regular' }}
                          >
                            Signup time: {getReadableDate(e.signup_time)}
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
                                      fontFamily: 'Montserrat-Bold',
                                    }}
                                  >
                                    {' '}
                                    {elem.question}{' '}
                                  </p>
                                  <p
                                    style={{
                                      fontSize: '12px',
                                      marginBottom: '6px',
                                      fontFamily: 'Montserrat-Regular',
                                    }}
                                  >
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
      <Modal centered show={openFilterModal} onHide={() => setOpenFilterModal(false)}>
        <Modal.Body>
          {/* eslint-disable */}
          <p
            style={{ fontFamily: 'Montserrat-Bold', cursor: 'pointer' }}
            onClick={() => filterResult('datewise')}
          >
            Date wise
          </p>
          <p
            style={{ fontFamily: 'Montserrat-Bold', cursor: 'pointer' }}
            onClick={() => filterResult('alphabetically')}
          >
            Alphabetically
          </p>
        </Modal.Body>
      </Modal>

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
