import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import fromUnixTime from 'date-fns/fromUnixTime';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import format from 'date-fns/format';
import { PageHeader, BatchesSelector } from '../Common';
import BottomNavigation from '../Common/BottomNavigation/BottomNavigation';
import { get, apiValidation, post, prodOrDev } from '../../Utilities';
import {
  getClientId,
  getClientUserId,
  getRoleArray,
} from '../../redux/reducers/clientUserId.reducer';
import { getCurrentBranding } from '../../redux/reducers/branding.reducer';
import userImage from '../../assets/images/user.svg';
import { getUserProfile } from '../../redux/reducers/userProfile.reducer';
import './NoticeBoard.scss';
import '../Dashboard/Dashboard.scss';
import FinalQuestionCard from '../HomeWorkCreator/FinalQuestionCard';

const NoticeBoard = (props) => {
  const { history, clientUserId, clientId, roleArray, currentbranding, userProfile } = props;
  const [notices, setNotices] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [filteredNotices, setFilteredNotices] = useState([]);
  const [newNotice, setNewNotice] = useState('');
  const [sendSMS, setSendSMS] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showBatchModal, setBatchModal] = useState(false);
  const [showStudentModal, setStudentModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editNoticeModal, setEditNoticeModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [noticeType, setNoticeType] = useState('');
  const [editedNotice, setEditedNotice] = useState('');
  const [sendEveryoneType, setSendEveryoneType] = useState('');
  const [typeModal, setTypeModal] = useState(false);

  const getTopicArray = (type = 'everyone') => {
    const env = prodOrDev();
    if (type === 'everyone') {
      if (env === 'production') {
        return [`productioninstitute${clientId}`];
      }
      return [`developmentinstitute${clientId}`];
    }
    if (type === 'student') {
      if (env === 'production') {
        const topicArray = selectedBatches.map((elem) => {
          return `productionbatch${elem.client_batch_id}`;
        });
        return topicArray;
      }
      const topicArray = selectedBatches.map((elem) => {
        return `developmentbatch${elem.client_batch_id}`;
      });
      return topicArray;
    }
    if (type === 'parent') {
      if (env === 'production') {
        const topicArray = selectedStudents.map((elem) => {
          return `productionuser${elem.client_user_id}`;
        });
        return topicArray;
      }

      const topicArray = selectedStudents.map((elem) => {
        return `developmentuser${elem.client_user_id}`;
      });
      return topicArray;
    }
    return null;
  };

  const getNotices = useCallback(() => {
    let isAdmin = false;
    if (roleArray.includes(4)) isAdmin = true;

    const payload = {
      client_user_id: clientUserId,
      client_id: clientId,
      is_admin: isAdmin,
    };

    get(payload, '/getAllNoticesOfUser')
      .then((res) => {
        const result = apiValidation(res);
        setNotices(result);
        setFilteredNotices(result);
        setIsLoading(false);
      })
      .catch((err) => console.error(err));
  }, [clientId, clientUserId, roleArray]);

  const handleClose = (option) => {
    if (option === 'everyone') {
      setNoticeType('everyone');
      const payload = {
        message: newNotice,
        client_user_id: clientUserId,
        client_id: clientId,
        type: sendEveryoneType,
      };

      if (option) {
        const topicArray = getTopicArray();
        post(payload, '/sendNoticeToEveryone')
          .then((res) => {
            if (res.success) {
              const newPayload = {
                message: newNotice,
                title: 'notice',
                type: 'client_notification',
                topic_array: JSON.stringify(topicArray),
                client_id: clientId,
                client_user_id: clientUserId,
              };

              const noticeMessagePayload = {
                message: newNotice,
                client_id: clientId,
                client_name: currentbranding.branding.client_name,
              };

              const notificationPromise = post(newPayload, '/sendNotification');
              let SMSPromise = null;
              if (sendSMS) SMSPromise = post(noticeMessagePayload, '/sendNoticeMessageToEveryone');

              console.log(noticeMessagePayload, newPayload);

              Promise.all([notificationPromise, SMSPromise])
                .then((response) => {
                  console.log(response);
                  getNotices();
                })
                .catch((err) => console.log('Promise.all ka err', err));
            }
          })
          .catch((e) => console.log(e));
      }
    } else if (option === 'parent') {
      setNoticeType('parent');
      setBatchModal(true);
    } else {
      setNoticeType('student');
      setBatchModal(true);
    }
    setShowModal(false);
    setTypeModal(false);
    // setNewNotice('');
  };
  const handleShow = () => setShowModal(true);

  // const handleBatchModal = () => setBatchModal(true);

  const getSelectedBatches = (batch) => {
    console.log(batch);
    setSelectedBatches(batch);
  };

  const closeBatchModal = () => {
    // getSelectedBatches();
    setBatchModal(false);
  };

  const closeStudentModal = () => {
    //  getSelectedBatches();
    setStudentModal(false);
  };

  const sendNoticeOrCallParent = () => {
    if (noticeType === 'student') {
      const BatchIdArray = selectedBatches.map((elem) => {
        return elem.client_batch_id;
      });

      const batchPayload = {
        message: newNotice,
        batch_array: JSON.stringify(BatchIdArray),
        client_user_id: clientUserId,
        client_id: clientId,
        type: 'batch_notice',
      };
      console.log(batchPayload);

      post(batchPayload, '/sendNotice')
        .then((response) => {
          if (response.success) {
            const topicArray = getTopicArray('student');
            const newPayload = {
              message: newNotice,
              title: 'notice',
              type: 'batch_notification',
              topic_array: JSON.stringify(topicArray),
              batch_array: JSON.stringify(JSON.stringify(BatchIdArray)),
              client_id: clientId,
              client_user_id: clientUserId,
            };

            const noticeMessagePayload = {
              message: newNotice,
              batch_array: JSON.stringify(JSON.stringify(BatchIdArray)),
              client_id: clientId,
              coaching_name: currentbranding.branding.client_name,
            };

            const notificationPromise = post(newPayload, '/sendNotification').then((res) => {});
            let SMSPromise = null;
            if (sendSMS)
              SMSPromise = post(
                noticeMessagePayload,
                '/sendNoticeMessageToStudents',
              ).then((res) => {});

            Promise.all([notificationPromise, SMSPromise])
              .then((resp) => {
                console.log(resp);
                getNotices();
                closeBatchModal();
              })
              .catch((err) => console.log('Promise.all ka err', err));
          }
        })
        .catch((e) => console.log(e));
    } else if (noticeType === 'parent') {
      const BatchIdArray = selectedBatches.map((elem) => {
        return elem.client_batch_id;
      });

      get({ batch_array: JSON.stringify(BatchIdArray) }, '/getStudentsOfBatchArray')
        .then((res) => {
          console.log(res);
          const result = apiValidation(res);
          if (result) {
            const transformedBatches = result.map((elem) => {
              return {
                ...elem,
                client_batch_id: elem.client_user_id,
                batch_name: elem.first_name + elem.last_name,
              };
            });
            setStudents(transformedBatches);
            setBatchModal(false);
            setStudentModal(true);
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const callParent = () => {
    const clientUserIdArray = selectedStudents.map((elem) => {
      return elem.client_user_id;
    });

    const UserUserIdArray = selectedStudents.map((elem) => {
      return elem.user_user_id;
    });

    const studentPayload = {
      message: newNotice,
      user_array: JSON.stringify(clientUserIdArray),
      client_user_id: clientUserId,
      type: 'parent_notice',
      client_id: clientId,
    };

    post(studentPayload, '/sendNotice')
      .then((res) => {
        if (res.success) {
          const topicArray = getTopicArray('parent');
          const newPayload = {
            message: newNotice,
            title: 'notice',
            type: 'parent_notification',
            topic_array: JSON.stringify(topicArray),
            user_array: JSON.stringify(clientUserIdArray),
            client_id: clientId,
            client_user_id: clientUserId,
          };

          const SMSPayload = {
            message: newNotice,
            user_array: JSON.stringify(UserUserIdArray),
            coaching_name: currentbranding.branding.client_name,
          };

          const notificationPromise = post(newPayload, '/sendNotification');
          let SMSPromise = null;
          if (sendSMS) SMSPromise = post(SMSPayload, '/sendMessageToParent');

          console.log(SMSPayload, newPayload);

          Promise.all([notificationPromise, SMSPromise])
            .then((response) => {
              console.log(response);
              getNotices();
              closeStudentModal();
            })
            .catch((err) => console.log('Promise.all ka err', err));
        }
      })
      .catch((err) => console.log(err));
  };

  const getStudentBatches = (batch) => {
    console.log(batch);
    setSelectedStudents(batch);
  };

  const searchNotices = (search) => {
    const filteredNewNotices = notices.filter((elem) => {
      return elem.notice_text.includes(search);
    });

    setFilteredNotices(filteredNewNotices);
    console.log(search);
  };

  const openEditModal = (notice) => {
    console.log(notice);
    setEditModal(true);
    setSelectedNotice(notice);
    setEditedNotice(notice.notice_text);
  };

  const editNotice = () => {
    setEditModal(false);
    console.log('edit', selectedNotice);
    const payload = {
      client_id: clientId,
      message: editedNotice,
      // notice_text: editedNotice,
      notice_id: selectedNotice.notice_id,
    };
    console.log(payload);
    post(payload, '/editNotice').then((res) => {
      console.log(res, 'notice edited');
      setEditNoticeModal(false);
      getNotices();
    });
  };

  const deleteNotice = () => {
    console.log('delete', selectedNotice);
    post({ notice_id: selectedNotice.notice_id }, '/deleteNotice').then((res) => {
      console.log(res, 'notice deleted');
      getNotices();
      setEditModal(false);
    });
  };

  useEffect(() => {
    getNotices();
    const coachingPayload = { client_id: clientId };

    get(coachingPayload, '/getAllBatchesOfCoaching')
      .then((res) => {
        const result = apiValidation(res);
        setBatches(result);
      })
      .catch((e) => console.log(e));
  }, [clientId, clientUserId, roleArray, getNotices]);

  return (
    <div
      style={{
        backgroundColor: 'rgba(241, 249, 255, 1)',
        marginBottom: '1rem',
        paddingTop: '20px',
        minHeight: '100vh',
      }}
    >
      <PageHeader
        title='Notice Board'
        search
        transparentBlue
        placeholder='Search for Notices'
        searchFilter={searchNotices}
      />

      {(roleArray.includes(3) || roleArray.includes(4)) && (
        <Card
          style={{ marginTop: '55px' }}
          className='LiveClasses__Card NoticeBoard__inputCard mx-auto p-3'
        >
          <Row>
            <Col xs={2} style={{ textAlign: 'center' }}>
              <img
                src={userProfile.profileImage ? userProfile.profileImage : userImage}
                width='40'
                height='40'
                alt='profile'
                className='rounded-circle'
              />
            </Col>
            <Col xs={10}>
              <label className='has-float-label my-auto'>
                <textarea
                  className='form-control'
                  name='Your Post'
                  type='text'
                  placeholder='Write a Post'
                  onChange={(e) => setNewNotice(e.target.value)}
                />
                <span>Write a post</span>
              </label>
            </Col>
          </Row>
          <Row className='m-2'>
            {sendSMS && (
              <Col xs={6} className='p-0'>
                <p className='NoticeBoard__smsInfo m-0'>No. Of Characters: {newNotice.length}</p>
                <p className='NoticeBoard__smsInfo m-0'>
                  No. Of SMS: {Math.floor(newNotice.length / 160 + 1)}
                </p>
              </Col>
            )}
            <Col xs={6} className='ml-auto p-0'>
              <Form.Check
                type='checkbox'
                label='Also Send An Sms'
                bsPrefix='NoticeBoard__input'
                value={sendSMS}
                onClick={() => setSendSMS(!sendSMS)}
              />
            </Col>
          </Row>
          {newNotice && (
            <Button variant='boldText' className='ml-auto mt-3' onClick={() => handleShow()}>
              Send
            </Button>
          )}
        </Card>
      )}
      {roleArray.includes(3) || roleArray.includes(4) ? null : <div className='pt-4' />}
      <Row className='mt-5 ml-3 mb-3'>
        <span className='Dashboard__noticeBoardText NoticeBoard__HeadingText'>Latest Notices</span>
        {/* <span className='ml-auto' style={{ color: 'rgba(117, 117, 117, 1)' }}>
          <ChevronRightIcon />
        </span> */}
      </Row>
      {isLoading ? (
        <div className='w-100 d-flex justify-content-center'>
          <Spinner animation='border' role='status'>
            <span className='d-none'>Loading...</span>
          </Spinner>
        </div>
      ) : (
        filteredNotices.map((elem) => (
          <div
            key={`elem${elem.notice_id}`}
            className='Dashboard__notice NoticeBoard__notice mx-auto'
          >
            <Row className='NoticeBoard__NoticeHead'>
              <Col xs={2} className='p-4'>
                <img
                  src={elem.profile_image ? elem.profile_image : userImage}
                  alt='profile'
                  className='Dashboard__noticeImage d-block mx-auto'
                />
              </Col>
              <Col xs={8} className='pt-4'>
                <p className='Dashboard__scrollableCardHeading m-0'>
                  {`${elem.first_name} ${elem.last_name}`}
                </p>
                <p className='Dashboard__noticeSubHeading'>
                  {format(fromUnixTime(elem.time_of_notice), 'hh:m bbbb, do MMM yyy')}
                </p>
              </Col>
              <Col xs={2} className='p-4 text-center'>
                <MoreVertIcon style={{ cursor: 'pointer' }} onClick={() => openEditModal(elem)} />
              </Col>
            </Row>
            <p className='p-2 Dashboard__noticeText notice-text'>{elem.notice_text}</p>
          </div>
        ))
      )}

      <Modal show={showModal} onHide={handleClose} centered keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Whom do you want to send?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <Button variant='boldText' className='ml-auto mt-3' onClick={() => setTypeModal(true)}>
              Everyone
            </Button>
          </p>
          <p>
            <Button
              variant='boldText'
              className='ml-auto mt-3'
              onClick={() => handleClose('parent')}
            >
              Parent
            </Button>
          </p>
          <p>
            <Button
              variant='boldText'
              className='ml-auto mt-3'
              onClick={() => handleClose('student')}
            >
              Student
            </Button>
          </p>
        </Modal.Body>
      </Modal>

      <Modal show={typeModal} onHide={() => setTypeModal(false)} centered keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Select the type of batch to which you want to send this notice:</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            role='button'
            tabIndex={-1}
            className={
              sendEveryoneType === 'active'
                ? 'NoticeBoard__modalText NoticeBoard__blueBack'
                : 'NoticeBoard__modalText'
            }
            onKeyDown={() => setSendEveryoneType('active')}
            onClick={() => setSendEveryoneType('active')}
          >
            Active
          </div>
          <div
            role='button'
            tabIndex={-1}
            className={
              sendEveryoneType === 'inactive'
                ? 'NoticeBoard__modalText NoticeBoard__blueBack'
                : 'NoticeBoard__modalText'
            }
            onClick={() => setSendEveryoneType('inactive')}
            onKeyDown={() => setSendEveryoneType('inactive')}
          >
            Inactive
          </div>
          <div
            tabIndex={-1}
            role='button'
            className={
              sendEveryoneType === 'both'
                ? 'NoticeBoard__modalText NoticeBoard__blueBack'
                : 'NoticeBoard__modalText'
            }
            onClick={() => setSendEveryoneType('both')}
            onKeyDown={() => setSendEveryoneType('both')}
          >
            Both active and inactive
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='boldText' onClick={() => handleClose('everyone')}>
            Send
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showBatchModal} onHide={closeBatchModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Batches</Modal.Title>
        </Modal.Header>
        <BatchesSelector
          batches={batches}
          getSelectedBatches={getSelectedBatches}
          title='Batches'
          selectBatches={selectedBatches}
        />
        <Modal.Footer>
          <Button variant='boldText' onClick={() => sendNoticeOrCallParent()}>
            Next
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showStudentModal} onHide={closeStudentModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Students</Modal.Title>
        </Modal.Header>
        <BatchesSelector
          batches={students}
          getSelectedBatches={getStudentBatches}
          title='Students'
          selectBatches={selectedStudents}
        />
        <Modal.Footer>
          <Button variant='boldText' onClick={() => callParent()}>
            Next
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal centered show={editModal} onHide={() => setEditModal(false)}>
        <Modal.Body className='p-3'>
          {/* eslint-disable */}
          <p
            onClick={() => setEditNoticeModal(true)}
            className='NoticeBoard__modalText d-flex align-items-center'
          >
            <EditIcon className='mr-2' />
            Edit
          </p>
          <p onClick={deleteNotice} className='NoticeBoard__modalText d-flex align-items-center'>
            <DeleteIcon className='mr-2' />
            Delete
          </p>
        </Modal.Body>
      </Modal>

      <Modal show={editNoticeModal} centered onHide={() => setEditNoticeModal(false)}>
        <Modal.Header closeButton>Edit Notice</Modal.Header>
        <Modal.Body>
          <Card
            style={{ border: 'transparent', width: '95%' }}
            className='LiveClasses__Card NoticeBoard__inputCard mx-auto p-3'
          >
            <Row>
              <Col xs={2} style={{ textAlign: 'center' }}>
                <img
                  src={userProfile.profileImage ? userProfile.profileImage : userImage}
                  width='40'
                  height='40'
                  alt='profile'
                  className='rounded-circle'
                />
              </Col>
              <Col xs={10}>
                <label className='has-float-label my-auto'>
                  <textarea
                    className='form-control'
                    name='Your Post'
                    type='text'
                    placeholder='Edit Post'
                    value={editedNotice}
                    onChange={(e) => setEditedNotice(e.target.value)}
                  />
                  <span>Edit post</span>
                </label>
              </Col>
            </Row>
            <Row className='m-2'>
              {sendSMS && (
                <Col xs={6} className='p-0'>
                  <p className='NoticeBoard__smsInfo m-0'>
                    No. Of Characters: {editedNotice.length}
                  </p>
                  <p className='NoticeBoard__smsInfo m-0'>
                    No. Of SMS: {Math.floor(editedNotice.length / 160 + 1)}
                  </p>
                </Col>
              )}
              <Col xs={6} className='ml-auto p-0'>
                <Form.Check
                  type='checkbox'
                  label='Also Send An Sms'
                  bsPrefix='NoticeBoard__input'
                  value={sendSMS}
                  onClick={() => setSendSMS(!sendSMS)}
                />
              </Col>
            </Row>
            {editedNotice && (
              <Button variant='boldText' className='ml-auto mt-3' onClick={editNotice}>
                Send
              </Button>
            )}
          </Card>
        </Modal.Body>
      </Modal>

      <BottomNavigation history={history} activeNav='noticeBoard' />
    </div>
  );
};

const mapStateToProps = (state) => ({
  currentbranding: getCurrentBranding(state),
  clientId: getClientId(state),
  clientUserId: getClientUserId(state),
  roleArray: getRoleArray(state),
  userProfile: getUserProfile(state),
});

export default connect(mapStateToProps)(NoticeBoard);

NoticeBoard.propTypes = {
  clientUserId: PropTypes.number.isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  clientId: PropTypes.number.isRequired,
  roleArray: PropTypes.instanceOf(Array).isRequired,
  currentbranding: PropTypes.shape({
    branding: PropTypes.shape({
      client_name: PropTypes.string,
    }),
    userProfile: PropTypes.shape({
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string,
      contact: PropTypes.string.isRequired,
      profileImage: PropTypes.string,
    }),
  }).isRequired,
  userProfile: PropTypes.shape({
    profileImage: PropTypes.string,
  }),
};

NoticeBoard.defaultProps = {
  userProfile: PropTypes.shape({
    profileImage: '',
  }),
};
