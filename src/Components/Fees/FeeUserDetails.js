import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
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
  const [change, setChange] = useState();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDateSelectorModal, setShowStartDateSelectorModal] = useState(false);
  const [showEndDateSelectorModal, setShowEndDateSelectorModal] = useState(false);

  const changeStartDate = () => setShowStartDateSelectorModal(true);
  const handleClose1 = () => setShowStartDateSelectorModal(false);

  const changeEndDate = () => setShowEndDateSelectorModal(true);
  const handleClose2 = () => setShowEndDateSelectorModal(false);

  const changeStart = (nextValue) => {
    setStartDate(nextValue);
  };

  const changeEnd = (nextValue) => {
    setEndDate(nextValue);
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

  const formatDate = (date) => {
    if (!date) return 'NA';

    return String(new Date(+date * 1000))
      .slice(4, 15)
      .replaceAll(' ', '-');
  };

  const downloader = () => {
    const payload = {
      client_batch_id: history.location.state.batchId,
      start_date: startDate.getTime() / 1000,
      end_date: endDate.getTime() / 1000,
    };
    console.log(payload);
    get(payload, '/getFeeDataOfUsersOfBatch').then((res) => {
      const result = apiValidation(res);
      if (!result.length) {
        Swal.fire({
          title: 'No Data found',
          text: 'No fees data was found between the selected start and end date',
          icon: 'alert',
          confirmButtonText: `OK`,
        }).then((butn) => {
          if (butn.isConfirmed) {
            setShow(false);
          }
        });
        return;
      }
      const jsonDataToDownload = result.map((ele, index) => {
        return {
          SNo: index + 1,
          First_name: ele.first_name,
          Last_name: ele.last_name,
          Status: ele.status,
          Amount: ele.amount,
          Due_date: formatDate(ele.due_date),
          Paid_At: formatDate(ele.paid_at),
        };
      });
      json2xlsDownload(JSON.stringify(jsonDataToDownload), 'studentFeeData', true);
      setEndDate(new Date());
      handleClose();
    });
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
          <Modal.Title style={{ color: 'var(--primary-blue)', fontFamily: 'Montserrat-SemiBold' }}>
            Select The Duration
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '33% 33% 33%',
              textAlign: 'center',
              fontFamily: 'Montserrat-regular',
            }}
          >
            <div>
              <p>From</p>
              <button
                onClick={() => {
                  changeStartDate();
                }}
                type='button'
                style={{ border: 'none', backgroundColor: 'white' }}
              >
                <h6>
                  Start Date{change}
                  <DateRangeIcon
                    onClick={() => {
                      changeStartDate();
                    }}
                    style={{ marginLeft: '6px' }}
                  />
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
                  changeEndDate();
                }}
              >
                <h6>
                  End Date{change}
                  <DateRangeIcon
                    onClick={() => {
                      changeEndDate();
                    }}
                    style={{ marginLeft: '6px' }}
                  />
                </h6>
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
                fontFamily: 'Montserrat-SemiBold',
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
                fontFamily: 'Montserrat-SemiBold',
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
      <Modal show={showStartDateSelectorModal} onHide={handleClose1} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Start Date</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ display: 'flex', justifyContent: 'center' }}>
          <Calendar onChange={changeStart} value={startDate} maxDate={endDate} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant='boldTextSecondary' onClick={() => handleClose1()}>
            Cancel
          </Button>
          <Button variant='boldText' onClick={handleClose1}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEndDateSelectorModal} onHide={handleClose2} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select End Date</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ display: 'flex', justifyContent: 'center' }}>
          <Calendar onChange={changeEnd} value={endDate} minDate={startDate} maxDate={new Date()} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant='boldTextSecondary' onClick={() => handleClose2()}>
            Cancel
          </Button>
          <Button variant='boldText' onClick={handleClose2}>
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
