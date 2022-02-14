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
import DownloadIcon from '@material-ui/icons/GetApp';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TuneIcon from '@material-ui/icons/Tune';
import InfiniteScroll from 'react-infinite-scroll-component';
import avatarImage from '../../assets/images/user.svg';
import { PageHeader } from '../Common/PageHeader/PageHeader';
import BottomNavigation from '../Common/BottomNavigation/BottomNavigation';
import { getClientId } from '../../redux/reducers/clientUserId.reducer';
import { admissionActions } from '../../redux/actions/admissions.action';
import AdmissionStyle from '../Admissions/Admissions.style';
import { apiValidation, get, json2xlsDownload } from '../../Utilities';
import Enquiry from '../Login/AdmissionChat/Enquiry/Enquiry';

const CRM = (props) => {
  const { clientId, history, setAdmissionUserProfileToStore } = props;
  const [inquiryArray, setInquiryArray] = useState([]);
  const [searchedInquiryArray, setSearchedInquiryArray] = useState([]);
  const [admissionFormArray, setAdmissionFormArray] = useState([]);
  const [searchedAdmissionFormArray, setSearchedAdmissionFormArray] = useState([]);
  const [searchString, setSearchString] = useState('');
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [enquiryPage, setEnquiryPage] = useState(1);
  const [admissionPage, setAdmissionPage] = useState(1);
  // const [searchEnquiryPage, setSearchEnquiryPage] = useState(1);
  const [sortBy, setSortBy] = useState('date');
  const [currentTab, setCurrentTab] = useState('Enquiries');

  // const infiniteScroll = () => {
  //   console.log(currentTab);
  //   if (
  //     window.innerHeight + document.documentElement.scrollTop >=
  //       document.documentElement.offsetHeight- 200 ||
  //     window.innerHeight + document.body.scrollTop >= document.body.offsetHeight- 200
  //   ) {
  //     if (currentTab === 'Enquiries') setEnquiryPage((prev) => prev + 1);
  //     if (currentTab === 'Admission') setAdmissionPage((prev) => prev + 1);
  //   }
  // };

  // useEffect(() => {
  //   window.addEventListener('scroll', infiniteScroll);

  //   return () => window.removeEventListener('scroll', infiniteScroll);
  // }, [currentTab]);

  const infiniteScroll = () => {
    if (currentTab === 'Enquiries') setEnquiryPage((prev) => prev + 1);
    if (currentTab === 'Admission') setAdmissionPage((prev) => prev + 1);
  };

  // useEffect(() => {
  //   const payload = {
  //     client_id: clientId,
  //     page: enquiryPage,
  //     sort_by: sortBy,
  //   };
  //   get(payload, '/getInquiriesOfClient').then((res) => {
  //     const result = apiValidation(res);
  //     const resultant = [...inquiryArray, ...result];
  //     console.log(result, 'getInquiryOfClient');
  //     setInquiryArray(result);
  //   });
  // }, [sortBy]);

  // useEffect(() => {
  //   const payload = {
  //     client_id: clientId,
  //     page: admissionPage,
  //     sort_by: sortBy,
  //   };
  //   get(payload, '/getAdmissionsOfClient').then((res) => {
  //     const result = apiValidation(res);
  //     const resultant = [...admissionFormArray, ...result];
  //     console.log(result);
  //     setAdmissionFormArray(result);
  //   });
  // }, [sortBy]);

  // SEARCH API INQUIRY
  useEffect(() => {
    let timer;
    if (searchString.length > 0 && currentTab === 'Enquiries') {
      timer = setTimeout(() => {
        const payload = {
          client_id: clientId,
          sort_by: sortBy,
          page: enquiryPage,
          keyword: searchString,
        };
        get(payload, '/getInquiriesOfClient').then((res) => {
          const result = apiValidation(res);
          if (!result) return;
          console.log(result, 'searchInquiriesOfClient');
          const resultant = [...searchedInquiryArray, ...result];
          setInquiryArray(resultant);
        });
      }, 500);
    }
    if (searchString.length === 0 && currentTab === 'Enquiries') {
      const payload = {
        client_id: clientId,
        page: enquiryPage,
        sort_by: sortBy,
      };
      get(payload, '/getInquiriesOfClient').then((res) => {
        const result = apiValidation(res);
        console.log(result, 'getInquiriesOfClient');
        const resultant = [...inquiryArray, ...result];
        setInquiryArray(resultant);
      });
    }
    return () => {
      clearTimeout(timer);
    };
  }, [searchString, sortBy, currentTab, enquiryPage, document.documentElement.clientHeight]);

  // SEARCH API ADDMISSION
  useEffect(() => {
    let timer;
    if (searchString.length > 0 && currentTab === 'Admission') {
      timer = setTimeout(() => {
        const payload = {
          client_id: clientId,
          page: admissionPage,
          keyword: searchString,
          sort_by: sortBy,
        };
        get(payload, '/getAdmissionsOfClient').then((res) => {
          const result = apiValidation(res);
          if (!result) return;
          console.log(result, 'searchAdmissionsOfClient');
          const resultant = [...searchedAdmissionFormArray, ...result];
          setAdmissionFormArray(resultant);
        });
      }, 500);
    }
    if (searchString.length === 0 && currentTab === 'Admission') {
      const payload = {
        client_id: clientId,
        page: admissionPage,
        sort_by: sortBy,
      };
      get(payload, '/getAdmissionsOfClient').then((res) => {
        const result = apiValidation(res);
        console.log(result, 'getAdmissionOfClient');
        const resultant = [...admissionFormArray, ...result];
        setAdmissionFormArray(resultant);
      });
    }
    return () => {
      clearTimeout(timer);
    };
  }, [searchString, sortBy, currentTab, admissionPage, document.documentElement.clientHeight]);

  const filterResult = (how) => {
    if (how === 'alphabetically') {
      setEnquiryPage(1);
      setAdmissionPage(1);
      setInquiryArray([]);
      setAdmissionFormArray([]);
      setSortBy('name');
    } else {
      setEnquiryPage(1);
      setAdmissionPage(1);
      setInquiryArray([]);
      setAdmissionFormArray([]);
      setSortBy('date');
    }
    setOpenFilterModal(false);
  };

  const searchCRM = (search) => {
    setSearchString(search);
    if (!search) window.scrollTo(0, 0);
    if (currentTab === 'Admission') {
      setAdmissionPage(1);
      setAdmissionFormArray([]);
      setSearchedAdmissionFormArray([]);
    } else if (currentTab === 'Enquiry') {
      setEnquiryPage(1);
      setInquiryArray([]);
      setSearchedInquiryArray([]);
    }
  };

  const goToDashboard = () => {
    history.push('/');
  };

  const getReadableDate = (stamp) => {
    return new Date(stamp * 1000).toString().split(' ').slice(1, 5).join(' ');
  };

  const handleSelect = (tab) => {
    setCurrentTab(tab);
    window.scrollTo(0, 0);
  };

  const downloadXlsFile = () => {
    if (currentTab === 'Enquiries') {
      console.log('download inq');
      const jsonDataToDownload = inquiryArray.map((ele, index) => {
        return {
          SNo: index + 1,
          First_name: ele.first_name,
          Last_name: ele.last_name,
          Contact: ele.contact,
          Email: ele.email,
          Address: ele.address,
          Parent_contact: ele.parent_contact,
          Parent_name: ele.parent_name,
        };
      });
      console.log(jsonDataToDownload);
      json2xlsDownload(JSON.stringify(jsonDataToDownload), 'GuestUserFormData', true);
    } else {
      console.log('download adm');
      const jsonDataToDownload = admissionFormArray.map((ele, index) => {
        const questionsArray = ele.question_array.map((ques) => {
          return `Q. ${ques.question}\nA. ${ques.response}\n`;
        });
        return {
          SNo: index + 1,
          First_name: ele.first_name,
          Last_name: ele.last_name,
          Contact: ele.contact,
          Email: ele.email,
          Address: ele.address,
          Parent_contact: ele.parent_contact,
          Parent_name: ele.parent_name,
          questions: questionsArray.join(''),
        };
      });
      console.log(jsonDataToDownload);
      json2xlsDownload(JSON.stringify(jsonDataToDownload), 'AdmissionFormData', true);
    }
  };

  return (
    <div>
      <PageHeader
        title='CRM'
        search
        filter
        customIcon={<DownloadIcon />}
        handleCustomIcon={downloadXlsFile}
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
        activeKey={currentTab}
        onSelect={handleSelect}
      >
        <Tab
          eventKey='Enquiries'
          onClick={() => handleSelect('Enquiries')}
          title='Guest Users'
          style={{ marginTop: '0rem', marginBottom: '1rem' }}
        >
          <div css={AdmissionStyle.UserCards}>
            <InfiniteScroll
              dataLength={inquiryArray.length}
              next={infiniteScroll}
              hasMore
              loader={<h4 />}
              height={document.documentElement.clientHeight - 130}
            >
              {inquiryArray.map((inquiry) => {
                return (
                  <Card
                    css={AdmissionStyle.card}
                    key={inquiry.user_id + inquiry.first_name}
                    className=''
                    onClick={() => {
                      setAdmissionUserProfileToStore(inquiry);
                      history.push('/crm/user');
                    }}
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
            </InfiniteScroll>
          </div>
        </Tab>
        <Tab
          eventKey='Admission'
          onClick={() => handleSelect('Admission')}
          title='Admission Form'
          style={{ marginTop: '0rem', marginBottom: '1rem' }}
        >
          <div css={AdmissionStyle.UserCards}>
            <InfiniteScroll
              dataLength={admissionFormArray.length}
              next={infiniteScroll}
              hasMore
              height={document.documentElement.clientHeight - 130}
              loader={<h4 />}
            >
              {admissionFormArray.map((e) => {
                return (
                  <Accordion key={e.user_id + e.first_name}>
                    <Card
                      onClick={() => {
                        setAdmissionUserProfileToStore(e);
                        history.push('/crm/user');
                      }}
                      css={AdmissionStyle.card}
                    >
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
            </InfiniteScroll>
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

const mapDispatchToProps = (dispatch) => {
  return {
    setAdmissionUserProfileToStore: (payload) => {
      dispatch(admissionActions.setAdmissionUserProfileToStore(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CRM);

CRM.propTypes = {
  clientId: PropTypes.number.isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  setAdmissionUserProfileToStore: PropTypes.func.isRequired,
};
