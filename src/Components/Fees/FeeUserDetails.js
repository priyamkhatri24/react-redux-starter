import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DownloadIcon from '@material-ui/icons/GetApp';
import DateRangeIcon from '@material-ui/icons/DateRange';
import SwapHorizontalCircleIcon from '@material-ui/icons/SwapHorizontalCircle';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { apiValidation, get, post, json2xlsDownload } from '../../Utilities';
import UserDataCard from '../Admissions/UsersDataCard';
import { PageHeader } from '../Common';
import { getClientId, getClientUserId } from '../../redux/reducers/clientUserId.reducer';
import './Fees.scss';

const FeeUserDetails = (props) => {
  const { history, clientId, clientUserId } = props;
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState('');
  const [recordText, setRecordsText] = useState('Loading records');
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState(new Date());
  const [change, setChange] = useState();
  const handleOpen1 = () => setShowModal(true);
  const handleClose1 = () => setShowModal(false);
  const changeDate = () => handleOpen1();
  const onChange = (nextValue) => setDate(nextValue);

  const updateButton1 = () => {
    setChange(setDate);
  };

  const goToTheDate = () => {
    // setUserdate(date);
    // history.push('/fees/users');
    // setChange(onChange());
    // handleClose1();
  };

  useEffect(() => {
    setTitle(history.location.state.batchName);
    console.log(history.location.state);
    get({ client_batch_id: history.location.state.batchId }, '/getFeeDataForBatch').then((res) => {
      console.log(res);
      const result = apiValidation(res);
      setUsers(result);
      setRecordsText('No records yet');
    });
  }, [history]);

  const notifyFeeUser = (userId, receiverId) => {
    const payload = {
      user_id: userId,
      title: 'Fee',
      topic:
        process.env.NODE_ENV === 'development'
          ? `developmentuser${receiverId}`
          : `productionuser${receiverId}`,
      sender_id: clientUserId,
      client_id: clientId,
      reciever_id: receiverId,
    };

    post(payload, '/notifyStudentForFee').then((res) => {
      if (res.success) {
        get({ client_batch_id: history.location.state.batchId }, '/getFeeDataForBatch').then(
          (resp) => {
            const result = apiValidation(resp);
            setUsers(result);
          },
        );
      }
    });
  };

  const goToFeePlan = (elem) => {
    history.push({
      pathname: '/fees/students',
      state: { studentData: elem },
    });
  };
  // const toTimestamp = (strDate) => {
  //   const dt = Date.parse(strDate);
  //   return dt / 1000;
  // };
  // console.log(toTimestamp(26 - 10 - 1999));

  const downloader = () => {
    const jsonDataToDownload = users.map((ele, index) => {
      return {
        SNo: index + 1,
        First_name: ele.first_name,
        Last_name: ele.last_name,
        users_status: ele.fee_status,
        contact: ele.contact,
      };
    });
    console.log(jsonDataToDownload);
    json2xlsDownload(JSON.stringify(jsonDataToDownload), 'studentFeeData', true);
  };

  return (
    <>
      <PageHeader
        title={title}
        handleCustomIcon={handleShow}
        customIcon={<DownloadIcon />}
        shadow
      />
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header>
          <Modal.Title style={{ color: 'var(--primary-blue)' }}>Select The Duration</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ display: 'grid', gridTemplateColumns: '33% 33% 33%', textAlign: 'center' }}>
            <div>
              <p>From</p>
              <button
                onClick={() => {
                  changeDate();
                }}
                type='button'
                style={{ border: 'none', backgroundColor: 'white' }}
              >
                <h6>
                  Start Date{change}
                  {/* <DateRangeIcon
                    onClick={() => {
                      changeDate();
                    }}
                  /> */}
                </h6>
              </button>
            </div>
            <div>
              <SwapHorizontalCircleIcon />
            </div>
            <div>
              <p>End</p>
              <button
                type='button'
                style={{ border: 'none', backgroundColor: 'white' }}
                onClick={() => {
                  changeDate();
                }}
              >
                <h6>End Date</h6>
              </button>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div>
            <Button
              style={{
                backgroundColor: 'white',
                border: 'none',
                color: 'var(--primary-blue)',
                fontSize: '2',
              }}
              onClick={handleClose}
            >
              <h6>CANCEL</h6>
            </Button>
            <Button
              style={{
                backgroundColor: 'white',
                border: 'none',
                color: 'var(--primary-blue)',
                fontSize: '2',
              }}
              onClick={downloader}
            >
              <h6>DOWNLOAD</h6>
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
      <div className='Fees__userDetails'>
        {users.length > 0 &&
          users.map((elem) => {
            return (
              <UserDataCard
                elem={elem}
                FeeUser
                history={history}
                key={elem.user_id}
                notifyFeeUser={notifyFeeUser}
                goToFeePlan={goToFeePlan}
              />
            );
          })}
        {users.length === 0 ? (
          <p className='mt-4 text-center' style={{ fontFamily: 'Montserrat-Medium' }}>
            {recordText}
          </p>
        ) : null}
      </div>
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Date</Modal.Title>
        </Modal.Header>
        <Modal.Body className='text-center'>
          <Calendar onChange={onChange} value={date} maxDate={new Date()} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant='boldTextSecondary' onClick={() => handleClose1()}>
            Cancel
          </Button>
          <Button variant='boldText' onClick={goToTheDate}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const mapStateToProps = (state) => ({
  clientId: getClientId(state),
  clientUserId: getClientUserId(state),
});

export default connect(mapStateToProps)(FeeUserDetails);

FeeUserDetails.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
  clientId: PropTypes.number.isRequired,
  clientUserId: PropTypes.number.isRequired,
};
