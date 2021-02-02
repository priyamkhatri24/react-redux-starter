import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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

const UserDetails = (props) => {
  const {
    history,
    clientId,
    userId,
    history: {
      location: {
        state: { user },
      },
    },
    clientUserId,
  } = props;
  const [batches, setBatches] = useState([]);
  const [allBatches, setAllBatches] = useState([]);
  const [showBatchModal, setShowBatchModal] = useState(false);

  const openBatchModal = () => setShowBatchModal(true);
  const closeBatchModal = () => {
    const batchPayload = {
      client_id: clientId,
      client_user_id: clientUserId,
    };

    const payload = {
      client_user_id: clientUserId,
      batch_add: JSON.stringify(batches),
      batch_remove: JSON.stringify(allBatches.filter((e) => e.user_id !== null)),
    };
    post(payload, '/changeBatchOfUser').then((resp) => {
      if (resp) {
        setShowBatchModal(false);
        get(batchPayload, '/getBatchInformationOfUser').then((res) => {
          const result = apiValidation(res);
          setBatches(result.current_batch);
          setAllBatches(result.final_batch);
        });
      }
    });
  };

  useEffect(() => {
    if (history.location.state && history.location.state.user) {
      console.log(history.location.state.user);
    }
  }, [history]);

  useEffect(() => {
    const batchPayload = {
      client_id: clientId,
      client_user_id: clientUserId,
    };

    get(batchPayload, '/getBatchInformationOfUser').then((res) => {
      const result = apiValidation(res);
      console.log(result);
      setBatches(result.current_batch);
      setAllBatches(result.final_batch);
    });
  }, [clientId, clientUserId]);

  const getSelectedBatches = (allbatches, selectedBatches) => {
    setBatches(selectedBatches);
    setAllBatches(allbatches);
  };

  const deleteUser = (id) => {
    post({ user_id: id }, '/deleteUser').then((res) => {
      if (res.success) {
        history.push('/admissions');
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
            <div className='LiveClasses__adminCard p-2 m-3' style={{ position: 'relative' }}>
              <div
                className='Courses__edit text-center py-1'
                onClick={() => {}}
                role='button'
                onKeyDown={() => {}}
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

              <h6 className='LiveClasses__adminHeading mb-0'>Mobile Number</h6>
              <p className='LiveClasses__adminDuration '>{user.contact}</p>

              <h6 className='LiveClasses__adminHeading mb-0'>Username</h6>
              <p className='LiveClasses__adminDuration '>{user.username}</p>
            </div>
          </Tab>
          <Tab eventKey='Batches' title='Batches'>
            <Row className='justify-content-end m-3'>
              <Button variant='customPrimary' onClick={() => openBatchModal()}>
                Change Batch <SwapHorizIcon />
              </Button>
            </Row>
            <Row className='justify-content-center'>
              {batches.map((elem) => {
                return (
                  <Col xs={5} key={elem.client_batch_id} className='p-2 StudyBin__box my-2 mx-2'>
                    <>
                      <span className='Dashboard__verticalDots'>
                        <MoreVertIcon />
                      </span>
                      <div className='m-2 text-center'>
                        <img src={userImage} alt='batchpic' height='40' width='40' />
                        <h6 className='text-center mt-3 Profile__batchName'>{elem.batch_name}</h6>
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
                title='Courses'
                selectBatches={batches}
                sendBoth
              />
              <Modal.Footer>
                <Button variant='boldText' onClick={() => closeBatchModal()}>
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
});

export default connect(mapStateToProps)(UserDetails);

UserDetails.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
  clientId: PropTypes.number.isRequired,
  clientUserId: PropTypes.number.isRequired,
  userId: PropTypes.number.isRequired,
};
