/** @jsxImportSource @emotion/react */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import fromUnixTime from 'date-fns/fromUnixTime';
import format from 'date-fns/format';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Modal from 'react-bootstrap/Modal';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import Button from 'react-bootstrap/Button';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import { BatchesSelector, PageHeader } from '../Common';
import { getClientId, getClientUserId, getUserId } from '../../redux/reducers/clientUserId.reducer';
import { apiValidation, get, post } from '../../Utilities';
import userImage from '../../assets/images/user.svg';
import { getAdmissionUserProfile } from '../../redux/reducers/admissions.reducer';
import AdmissionStyle from './Admissions.style';
import '../Live Classes/LiveClasses.scss';

const UserDetails = (props) => {
  const { history, clientId, userId, user, clientUserId } = props;
  const [batches, setBatches] = useState([]);
  const [allBatches, setAllBatches] = useState([]);
  const [showBatchModal, setShowBatchModal] = useState(false);

  const openBatchModal = () => setShowBatchModal(true);
  const closeBatchModal = () => setShowBatchModal(false);

  const submitBatchModal = () => {
    const batchPayload = {
      client_id: clientId,
      client_user_id: user.client_user_id,
    };

    const payload = {
      client_user_id: user.client_user_id,
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
      client_user_id: user.client_user_id,
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
      title: 'Delete Section',
      text: 'Do you wish to delete this section?',
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

  return (
    <div className='Profile'>
      <PageHeader title='User Details' />
      <div style={{ marginTop: '6rem' }}>
        <Col className='text-center'>
          <img
            src={user.profile_image ? user.profile_image : userImage}
            width='100'
            height='100'
            alt='profile'
            className='rounded-circle'
          />
          <p className='Profile__mainName my-3'>{`${user.first_name} ${user.last_name}`}</p>
        </Col>
        <Tabs defaultActiveKey='Details' className='Profile__Tabs' justify>
          <Tab eventKey='Details' title='Details'>
            <div
              css={AdmissionStyle.adminCard}
              className='p-2 m-3'
              style={{ position: 'relative' }}
            >
              <div
                className='Courses__edit text-center py-1'
                onClick={() =>
                  history.push({ pathname: '/admissions/editprofile', state: { user } })
                } //eslint-disable-line
                role='button'
                onKeyDown={() =>
                  history.push({ pathname: '/admissions/editprofile', state: { user } })
                } //eslint-disable-line
                tabIndex='-1'
              >
                <CreateIcon />
              </div>
              {user.user_id !== userId && (
                <div
                  className='Profile__edit text-center py-1'
                  onClick={() => deleteUser(user.user_id)}
                  role='button'
                  onKeyDown={() => deleteUser(user.user_id)}
                  tabIndex='-1'
                >
                  <DeleteIcon />
                </div>
              )}
              <h6 className='LiveClasses__adminHeading mb-0'>First Name</h6>
              <p className='LiveClasses__adminDuration '>{user.first_name}</p>

              {user.last_name && (
                <>
                  <h6 className='LiveClasses__adminHeading mb-0'>Last Name</h6>
                  <p className='LiveClasses__adminDuration '>{user.last_name}</p>
                </>
              )}

              <h6 className='LiveClasses__adminHeading mb-0'>Mobile Number</h6>
              <p className='LiveClasses__adminDuration '>{user.contact}</p>

              {user.username && (
                <>
                  <h6 className='LiveClasses__adminHeading mb-0'>Username</h6>
                  <p className='LiveClasses__adminDuration '>{user.username}</p>
                </>
              )}
              {user.parent_name && (
                <>
                  <h6 className='LiveClasses__adminHeading mb-0'>Parent&apos;s Name</h6>
                  <p className='LiveClasses__adminDuration '>{user.parent_name}</p>
                </>
              )}
              {user.parent_contact && (
                <>
                  <h6 className='LiveClasses__adminHeading mb-0'>Parent&apos;s Mobile Number</h6>
                  <p className='LiveClasses__adminDuration '>{user.parent_contact}</p>
                </>
              )}
              {user.gender && (
                <>
                  <h6 className='LiveClasses__adminHeading mb-0'>Gender</h6>
                  <p className='LiveClasses__adminDuration '>{user.gender}</p>
                </>
              )}

              {user.email && (
                <>
                  <h6 className='LiveClasses__adminHeading mb-0'>Email Address</h6>
                  <p className='LiveClasses__adminDuration '>{user.email}</p>
                </>
              )}
              {user.address && (
                <>
                  <h6 className='LiveClasses__adminHeading mb-0'>Residential Address</h6>
                  <p className='LiveClasses__adminDuration '>{user.address}</p>
                </>
              )}
              {user.birthday && (
                <>
                  <h6 className='LiveClasses__adminHeading mb-0'>Date Of Birth</h6>
                  <p className='LiveClasses__adminDuration '>
                    {format(fromUnixTime(parseInt(user.birthday / 1000, 10)), 'dd-MMM-yyyy')}
                  </p>
                </>
              )}
            </div>
          </Tab>
          <Tab eventKey='Batches' title='Batches'>
            <Row className='justify-content-end m-3'>
              <Button variant='customPrimary' onClick={() => openBatchModal()}>
                Change Batch <SwapHorizIcon />
              </Button>
            </Row>
            <Row className='justify-content-between mx-2'>
              {batches.map((elem) => {
                return (
                  <Col
                    xs={5}
                    key={elem.client_batch_id}
                    css={AdmissionStyle.box}
                    className='p-2 my-2 mx-2'
                  >
                    <>
                      <span css={AdmissionStyle.verticalDots}>
                        <MoreVertIcon />
                      </span>
                      <div className='m-2 text-center'>
                        <img src={userImage} alt='batchpic' height='40' width='40' />
                        <h6 className=' Profile__batchName text-center mt-3'>{elem.batch_name}</h6>
                        <p className='Profile__batchStudents mb-0'>{elem.number_of_students}</p>
                        <p className='Profile__students'>students</p>
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
