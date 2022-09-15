/** @jsxImportSource @emotion/react */

import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import fromUnixTime from 'date-fns/fromUnixTime';
import format from 'date-fns/format';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Accordion from 'react-bootstrap/Accordion';
import Modal from 'react-bootstrap/Modal';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import Button from 'react-bootstrap/Button';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import { BatchesSelector, PageHeader } from '../Common';
import { getClientId, getClientUserId, getUserId } from '../../redux/reducers/clientUserId.reducer';
import { apiValidation, get, post } from '../../Utilities';
import userImage from '../../assets/images/user.svg';
import { getAdmissionUserProfile } from '../../redux/reducers/admissions.reducer';
import './Admissions.scss';
import '../Profile/Profile.scss';
import '../Courses/Courses.scss';
import AdmissionStyle from './Admissions.style';

const UserDetails = (props) => {
  const { history, clientId, userId, user, clientUserId } = props;
  const [batches, setBatches] = useState([]);
  const [allBatches, setAllBatches] = useState([]);
  const [admissionFormData, setAdmissionFormData] = useState([]);
  const [toggleIndex, setToggleIndex] = useState(0);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [userData, setUserData] = useState(user);
  const [batchCardOptionModal, setBatchCardOptionModal] = useState(false);
  const [triggeredBatch, setTriggeredBatch] = useState({});
  const accordionRef = useRef(null);
  const openBatchModal = () => setShowBatchModal(true);
  const closeBatchModal = () => {
    setShowBatchModal(false);
    setBatches([]);
  };

  useEffect(() => {
    if (history.location.state?.user) {
      setUserData(history.location.state?.user);
    }
  }, []);

  useEffect(() => {
    const payload = {
      client_id: clientId,
      /* eslint-disable */
      client_user_id: user?.client_user_id,
    };
    get(payload, '/getAdmissionFormResponseOfSingleUser').then((res) => {
      const result = apiValidation(res);
      setAdmissionFormData(result || []);
      console.log(result, 'getAdmissionFormResponseOfSingleUser');
    });
  }, []);

  const submitBatchModal = () => {
    const batchPayload = {
      client_id: clientId,
      client_user_id: userData.client_user_id,
    };

    const payload = {
      client_user_id: userData.client_user_id,
      batch_add: JSON.stringify(batches),
      batch_remove: JSON.stringify(
        allBatches.filter((e) => Object.prototype.hasOwnProperty.call(e, 'user_batch_id')),
      ),
    };

    console.log(batches);

    console.log(allBatches.filter((e) => Object.prototype.hasOwnProperty.call(e, 'user_batch_id')));

    post(payload, '/changeBatchOfUser').then((resp) => {
      if (resp) {
        setShowBatchModal(false);
        get(batchPayload, '/getBatchInformationOfUser').then((res) => {
          const result = apiValidation(res);
          if (res.success === 1) {
            setBatches(result.current_batch);
            setAllBatches(result.final_batch);
            Swal.fire({
              icon: 'success',
              title: 'Batches Changed!',
              text: `You have successfully added ${result.current_batch.length} batch(es)!`,
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops!',
              text: `Unable to change Batches`,
            });
          }
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: `Unable to change Batches`,
        });
      }
    });
  };

  useEffect(() => {
    const batchPayload = {
      client_id: clientId,
      client_user_id: userData.client_user_id,
    };

    get(batchPayload, '/getBatchInformationOfUser').then((res) => {
      const result = apiValidation(res);
      console.log(result);
      setBatches(result.current_batch);
      setAllBatches(result.final_batch);
    });
  }, [clientId, clientUserId, user]);

  const getSelectedBatches = (allbatches, selectedBatches) => {
    setBatches(selectedBatches);
    setAllBatches(allbatches);
  };

  const deleteUser = (id) => {
    Swal.fire({
      title: 'Delete User',
      text: 'Do you wish to delete this user?',
      icon: 'question',
      confirmButtonText: `Yes`,
      showDenyButton: true,
      customClass: 'Assignments__SweetAlert',
    }).then((resp) => {
      if (resp.isConfirmed) {
        post({ user_id: id }, '/deleteUser').then((res) => {
          if (res.success) {
            history.push('/admissions');
          }
        });
      }
    });
  };

  const toggleShowName = () => {
    if (toggleIndex === 0) {
      setToggleIndex(1);
    } else {
      setToggleIndex(0);
    }
  };

  const triggerBatchCardOptions = (batch) => {
    setTriggeredBatch(batch);
    setBatchCardOptionModal(true);
  };

  const closeBatchCardModal = () => {
    setBatchCardOptionModal(false);
  };

  const changeStudentActivityInBatch = (status) => {
    let status2;
    if (status === 'active') {
      status2 = 'inactive';
    } else {
      status2 = 'active';
    }
    const payload = {
      client_batch_id: triggeredBatch.client_batch_id,
      client_user_id: userData.client_user_id,
      status: status2,
    };
    post(payload, '/makeStudentActiveInactiveInBatch').then((res) => {
      console.log(res);
      closeBatchCardModal();
      if (res.success) {
        const newUserBatches = batches.map((ele) => {
          if (ele.user_batch_id === triggeredBatch.user_batch_id) {
            ele.user_batch_status = status2;
          }
          return ele;
        });
        setBatches(newUserBatches);
        Swal.fire({
          icon: 'success',
          title: 'Status changed!',
          text: `You have successfully made ${userData.first_name} ${userData.last_name} ${status2} in ${triggeredBatch.batch_name}!`,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: `Unable to change status`,
        });
      }
    });
  };

  return (
    <div className='Profile'>
      <PageHeader title='User Details' />
      <div style={{ marginTop: '6rem' }}>
        <Col className='text-center'>
          <img
            src={userData.profile_image ? userData.profile_image : userImage}
            width='100'
            height='100'
            alt='profile'
            className='rounded-circle'
          />
          <p className='Profile__mainName my-3'>{`${userData.first_name} ${userData.last_name}`}</p>
        </Col>
        <Tabs defaultActiveKey='Details' className='Profile__Tabs' justify>
          <Tab eventKey='Details' title='Details'>
            <Accordion>
              <div
                css={AdmissionStyle.adminCard}
                className='p-2'
                style={{ position: 'relative', marginTop: '1.5rem' }}
              >
                <div
                  className='Courses__edit text-center py-1'
                  onClick={() =>
                    history.replace({
                      pathname: '/admissions/editprofile',
                      state: { user: userData },
                    })
                  } //eslint-disable-line
                  role='button'
                  onKeyDown={() =>
                    history.replace({
                      pathname: '/admissions/editprofile',
                      state: { user: userData },
                    })
                  } //eslint-disable-line
                  tabIndex='-1'
                >
                  <CreateIcon />
                </div>
                {userData.user_id !== userId && (
                  <div
                    className='Profile__edit text-center py-1'
                    onClick={() => deleteUser(userData.user_id)}
                    role='button'
                    onKeyDown={() => deleteUser(userData.user_id)}
                    tabIndex='-1'
                  >
                    <DeleteIcon />
                  </div>
                )}
                <h6 className='Batch__heading mb-0'>First Name</h6>
                <p className=' Batch__details '>{userData.first_name}</p>

                {userData.last_name && (
                  <>
                    <h6 className=' Batch__heading mb-0'>Last Name</h6>
                    <p className=' Batch__details '>{userData.last_name}</p>
                  </>
                )}

                <h6 className=' Batch__heading mb-0'>Mobile Number</h6>
                <p className=' Batch__details '>{userData.contact}</p>

                {userData.username && (
                  <>
                    <h6 className=' Batch__heading mb-0'>Username</h6>
                    <p className=' Batch__details '>{userData.username}</p>
                  </>
                )}
                {userData.parent_name && (
                  <>
                    <h6 className=' Batch__heading mb-0'>Parent&apos;s Name</h6>
                    <p className=' Batch__details '>{userData.parent_name}</p>
                  </>
                )}
                {userData.parent_contact && (
                  <>
                    <h6 className='Batch__heading mb-0'>Parent&apos;s Mobile Number</h6>
                    <p className=' Batch__details '>{userData.parent_contact}</p>
                  </>
                )}
                {userData.gender && (
                  <>
                    <h6 className='Batch__heading mb-0'>Gender</h6>
                    <p className='Batch__details '>{userData.gender}</p>
                  </>
                )}

                {userData.email && (
                  <>
                    <h6 className='Batch__heading mb-0'>Email Address</h6>
                    <p className='Batch__details '>{userData.email}</p>
                  </>
                )}
                {userData.address && (
                  <>
                    <h6 className='Batch__heading mb-0'>Residential Address</h6>
                    <p className='Batch__details '>{userData.address}</p>
                  </>
                )}
                {userData.birthday && userData.birthday !== 'NaN' && (
                  <>
                    <h6 className='Batch__heading mb-0'>Date Of Birth</h6>
                    <p className='Batch__details '>
                      {format(fromUnixTime(parseInt(userData.birthday, 10)), 'dd-MMM-yyyy')}
                    </p>
                  </>
                )}
                <div>
                  <Accordion.Collapse ref={accordionRef} eventKey='0'>
                    <div className='m-0'>
                      <p className='Batch__admissionFormDetailsText mb-0'>
                        {admissionFormData.length
                          ? 'Admission form filled:'
                          : 'Admission Form not filled.'}
                      </p>
                      {admissionFormData?.map((elem) => {
                        return (
                          <div>
                            <h6 className='Batch__heading mb-0'>{elem.english_text}</h6>
                            <p className='Batch__details'>{elem.response}</p>
                          </div>
                        );
                      })}
                    </div>
                  </Accordion.Collapse>
                  <Accordion.Toggle onClick={toggleShowName} as='div' eventKey='0'>
                    <p className='Batch__showMoreText'>
                      <strong>{toggleIndex === 0 ? 'show more' : 'show less'}</strong>
                      {toggleIndex === 0 ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                    </p>
                  </Accordion.Toggle>
                </div>
              </div>
            </Accordion>
          </Tab>
          <Tab eventKey='Batches' title='Batches'>
            <Row className='justify-content-end m-3'>
              <Button variant='customPrimary' onClick={() => openBatchModal()}>
                Change Batch <SwapHorizIcon />
              </Button>
            </Row>
            <Row className='justify-content-center mx-2'>
              {batches.map((elem) => {
                return (
                  <Col
                    xs={5}
                    key={elem.client_batch_id}
                    css={AdmissionStyle.box}
                    className='p-2 my-2 mx-2'
                    style={
                      elem.batch_status === 'inactive'
                        ? { backgroundColor: 'rgba(238,238,238,0.8)', border: 'transparent' }
                        : {}
                    }
                  >
                    <>
                      <span
                        onClick={() => triggerBatchCardOptions(elem)}
                        css={AdmissionStyle.verticalDots}
                      >
                        <MoreVertIcon />
                      </span>
                      <div className='m-2 text-center'>
                        <img src={userImage} alt='batchpic' height='40' width='40' />
                        <h6 className=' Profile__batchName text-center mt-3'>
                          {elem.batch_name} {elem.batch_status === 'inactive' ? '(inactive)' : null}
                        </h6>
                        {elem.user_batch_status === 'inactive' ? (
                          <p className='Profile__students mb-0'>Currently inactive in this batch</p>
                        ) : (
                          <>
                            <p className='Profile__batchStudents mb-0'>{elem.number_of_students}</p>
                            <p className='Profile__students'>students</p>
                          </>
                        )}
                      </div>
                    </>
                  </Col>
                );
              })}
            </Row>
            <Modal show={showBatchModal} onHide={closeBatchModal} centered>
              <Modal.Header closeButton>
                <Modal.Title>Select Batches</Modal.Title>
              </Modal.Header>
              <BatchesSelector
                batches={allBatches}
                getSelectedBatches={getSelectedBatches}
                title='Batches'
                selectBatches={batches}
                sendBoth
              />
              <Modal.Footer>
                <Button variant='boldText' onClick={() => submitBatchModal()}>
                  Done
                </Button>
              </Modal.Footer>
            </Modal>
            <Modal show={batchCardOptionModal} onHide={closeBatchCardModal} centered>
              <Modal.Body>
                Do you wish to make {userData.first_name} {userData.last_name}{' '}
                {triggeredBatch.user_batch_status === 'active' ? 'inactive' : 'active'} in{' '}
                {triggeredBatch.batch_name}?
              </Modal.Body>
              <Modal.Footer>
                <Button variant='boldText' onClick={() => closeBatchCardModal()}>
                  cancel
                </Button>
                <Button
                  variant='boldText'
                  onClick={() => changeStudentActivityInBatch(triggeredBatch.user_batch_status)}
                >
                  yes
                </Button>
              </Modal.Footer>
            </Modal>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  clientId: getClientId(state),
  clientUserId: getClientUserId(state),
  userId: getUserId(state),
  user: getAdmissionUserProfile(state),
});

export default connect(mapStateToProps)(UserDetails);

UserDetails.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
  user: PropTypes.instanceOf(Object).isRequired,
  clientId: PropTypes.number.isRequired,
  clientUserId: PropTypes.number.isRequired,
  userId: PropTypes.number.isRequired,
};
