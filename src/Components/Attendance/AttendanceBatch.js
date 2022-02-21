import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DateRangeIcon from '@material-ui/icons/DateRange';
import CheckIcon from '@material-ui/icons/Check';
import DownloadIcon from '@material-ui/icons/GetApp';
import { Swiper, SwiperSlide } from 'swiper/react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup';
import Swal from 'sweetalert2';
import Calendar from 'react-calendar';
import { getAttendanceBatch } from '../../redux/reducers/attendance.reducer';
import { PageHeader, AlertSlideup } from '../Common';
import PreviousAttendance from './PreviousAttendance';
import TakeAttendance from './TakeAttendance';
import 'react-calendar/dist/Calendar.css';
import './Attendance.scss';

// Import Swiper styles
import 'swiper/swiper.min.css';
import { apiValidation, get, post, json2xlsDownload } from '../../Utilities';
import { attendanceActions } from '../../redux/actions/attendance.action';
import { getClientId, getClientUserId } from '../../redux/reducers/clientUserId.reducer';
import { getCurrentBranding } from '../../redux/reducers/branding.reducer';

const AttendanceBatch = (props) => {
  const {
    attendanceBatch,
    setAttendanceSelectedDateToStore,
    history,
    clientUserId,
    clientId,
    currentbranding,
  } = props;
  const [showModal, setShowModal] = useState(false);
  const [showMonthsModal, setShowMonthsModal] = useState(false);
  const [date, setDate] = useState(new Date());
  const [students, setStudents] = useState([]);
  const [attendanceDate, setAttendanceDate] = useState('');
  const [submitStatus, setSubmitStatus] = useState(0);
  const [swiper, setSwiper] = useState(null);
  const [checked, setChecked] = useState(false);
  const [pastMonths, setPastMonths] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);

  const getInitialAttendanceData = useCallback(() => {
    get({ client_batch_id: attendanceBatch.client_batch_id }, '/getStudentsOfBatch').then((res) => {
      setSubmitStatus(res.status);
      setAttendanceDate(res.date);
      const result = apiValidation(res);
      setStudents(result);
    });
  }, [attendanceBatch]);

  useEffect(() => {
    getInitialAttendanceData();
  }, [getInitialAttendanceData]);

  const handleOpen = () => setShowModal(true);

  const handleClose = () => setShowModal(false);

  const changeDate = () => handleOpen();

  // const handleOpen1 = () => setShowMonthsModal(true);

  const handleClose1 = () => setShowMonthsModal(false);

  const onCheck = () => {
    setChecked(!checked);
  };

  const onChange = (nextValue) => {
    setDate(nextValue);
  };

  const goToTheDate = () => {
    console.log(date);
    setAttendanceSelectedDateToStore(date);
    history.push('/attendance/date');
  };

  const triggerSMSAndNotification = (studentArray, type) => {
    const payload = {
      client_id: clientId,
      coaching_name: currentbranding.branding.client_name,
      attendance_value: type,
      is_updated: submitStatus,
      user_array: JSON.stringify(
        studentArray.map((e) => {
          const obj = {};
          obj.user_user_id = e.user_user_id;
          obj.name = `${e.first_name} ${e.last_name}`;
          return obj;
        }),
      ),
    };
    // console.log(payload, 'smsPayload');
    post(payload, '/sendAttendanceMessageToParent').then((res) => console.log(res, 'hahaha'));

    const message = `Attendance updated to ${
      type === 'P' ? 'Present' : type === 'A' ? 'Absent' : 'Late'
    } for`;

    const userArray = studentArray.map((e) => e.user_user_id);
    const topicArray = userArray.map((e) => {
      const el =
        process.env.NODE_ENV === 'production' ? `productionuser${e}` : `developmentuser${e}`;
      return el;
    });

    const notificationPayload = {
      message,
      title: 'Attendance',
      type: 'attendance_notification',
      client_id: clientId,
      client_user_id: clientUserId,
      user_array: JSON.stringify(userArray),
      topic_array: JSON.stringify(topicArray),
    };

    post(notificationPayload, '/sendNotification').then((res) => console.log(res));
  };

  const submitAttendance = () => {
    console.log(students);

    const attendanceArray = students.map((e) => {
      delete e.contact;
      delete e.time_of_attendance;
      delete e.profile_image;
      return e;
    });

    const payload = {
      attendance_array: JSON.stringify(attendanceArray),
      client_batch_id: attendanceBatch.client_batch_id,
      client_user_id: clientUserId,
    };

    post(payload, '/submitOrUpdateAttendance').then((res) => {
      console.log(res);
      if (res.success) {
        const presentStudents = students.filter((e) => e.value === 'P');
        const absentStudents = students.filter((e) => e.value === 'A');
        const lateStudents = students.filter((e) => e.value === 'L');
        if (checked) {
          triggerSMSAndNotification(presentStudents, 'P');
          triggerSMSAndNotification(absentStudents, 'A');
          triggerSMSAndNotification(lateStudents, 'L');
        }
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: `Attendance successfully updated`,
        }).then((resp) => {
          if (resp.isConfirmed) {
            getInitialAttendanceData();
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

  const changeSlide = (index) => {
    swiper.slideTo(index);
  };

  function selected() {
    console.log('hii');
  }

  const download = () => {
    const jsonDataToDownload = students.map((ele, index) => {
      return {
        SNo: index + 1,
        First_name: ele.first_name,
        Last_name: ele.last_name,
        users_status: ele.fee_status,
        contact: ele.contact,
      };
    });
    console.log(jsonDataToDownload);
    json2xlsDownload(JSON.stringify(jsonDataToDownload), 'studentsAttendance', true);
  };

  const monthsArray = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const getMonths = () => {
    setShowMonthsModal(true);
    const tempPastMonths = [];
    const d = new Date();
    d.setDate(1);
    for (let i = 0; i <= 11; i++) {
      console.log(`${monthsArray[d.getMonth()]}-${d.getFullYear()}`);
      tempPastMonths.push({
        value: `${monthsArray[d.getMonth()]}-${d.getFullYear()}`,
        isChecked: false,
      });
      d.setMonth(d.getMonth() - 1);
    }
    setPastMonths(tempPastMonths);
  };

  const checkedAnotherMonth = (value) => {
    const newPastMonthsArray = pastMonths.map((ele) => {
      ele.isChecked = false;
      if (ele.value === value) ele.isChecked = true;
      return ele;
    });

    setPastMonths(newPastMonthsArray);
  };

  const downloadAttendanceDataMonthWise = () => {
    setShowMonthsModal(false);
    setIsDownloading(true);
    const selectedMonthYearPair = pastMonths.find((ele) => ele.isChecked === true);
    const selectedMonth = selectedMonthYearPair.value.split('-')[0];
    const selectedYear = selectedMonthYearPair.value.split('-')[1];

    const selectedMonthIndex = monthsArray.findIndex((ele) => ele === selectedMonth) + 1;
    console.log(selectedMonthIndex, selectedYear);
    const payload = {
      client_batch_id: attendanceBatch.client_batch_id,
      month: `${selectedYear}-${selectedMonthIndex}`,
    };
    console.log(payload);
    get(payload, '/getAttendanceOfBatchMonthWise').then((data) => {
      console.log(data, 'getAttendanceOfBatchMonthWise');
      const result = apiValidation(data);
      const dataToBeDownloaded = result.map((ele, index) => {
        delete ele.client_user_id;
        const resultant = { SNo: index + 1, ...ele };
        return resultant;
      });
      console.log(dataToBeDownloaded, attendanceBatch);
      const fileName = `${attendanceBatch.batch_name}-attendance-${selectedYear}-${selectedMonthIndex}`;
      json2xlsDownload(JSON.stringify(dataToBeDownloaded), fileName, true);
      setIsDownloading(false);
    });
  };

  return (
    <>
      <AlertSlideup trigger={isDownloading} alertText='Preparing your download. Please wait...' />
      <PageHeader
        title={attendanceBatch.batch_name}
        customIcon={<DownloadIcon />}
        customIcon2={<DateRangeIcon />}
        handleCustomIcon={getMonths}
        handleCustomIcon2={changeDate}
      />
      <Swiper
        spaceBetween={50}
        slidesPerView={1}
        onSlideChange={() => console.log('slide change')}
        onSwiper={(s) => {
          console.log('initialize swiper', s);
          setSwiper(s);
        }}
        initialSlide={1}
      >
        <SwiperSlide>
          <PreviousAttendance changeSlide={changeSlide} />
        </SwiperSlide>
        <SwiperSlide>
          <TakeAttendance
            students={students}
            date={attendanceDate}
            submitStatus={submitStatus}
            updateStudents={setStudents}
            changeSlide={changeSlide}
          />
        </SwiperSlide>
      </Swiper>
      <div className='smsCheck'>
        <input
          type='checkbox'
          style={{ width: '20px', height: '30px' }}
          value={checked}
          onChange={onCheck}
        />
        <span style={{ marginLeft: '10px' }}>Also send an SMS</span>
      </div>
      <div className='d-flex justify-content-center my-2'>
        <Button variant='customPrimary' onClick={() => submitAttendance()}>
          {submitStatus ? 'Update' : 'Submit'}
        </Button>
      </div>
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Date</Modal.Title>
        </Modal.Header>
        <Modal.Body className='d-flex justify-content-center'>
          <Calendar onChange={onChange} value={date} maxDate={new Date()} />
          {/* <input
            className='form-control'
            name='date'
            type='date'
            placeholder='Assignment date'
            value={date}
            onChange={(e) => onChange(e.target.value)}
          /> */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant='boldText' onClick={() => handleClose()}>
            Cancel
          </Button>
          <Button variant='boldText' onClick={() => goToTheDate()}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
      {/* <Modal show={false} onHide={handleClose1} centered> */}
      <Modal show={showMonthsModal} onHide={handleClose1} centered>
        <Modal.Header closeButton>
          <Modal.Title className='monthsTitle'>Select The Duration</Modal.Title>
        </Modal.Header>
        <Modal.Body className='py-0'>
          {pastMonths.map((e) => {
            console.log(e);
            return (
              <Row
                style={{ backgroundColor: e.isChecked ? 'rgb(241,249,255)' : 'rgb(255,255,255)' }}
                onClick={() => checkedAnotherMonth(e.value)}
                key={e.value}
                className='monthStyle'
              >
                <Col>{e.value}</Col>
                <Col className='text-right'>
                  {e.isChecked ? <CheckIcon style={{ width: '18px' }} /> : null}
                </Col>
              </Row>
            );
          })}
        </Modal.Body>
        <Modal.Footer>
          <Button variant='boldText' onClick={handleClose1}>
            CANCEL
          </Button>
          <Button variant='boldText' onClick={downloadAttendanceDataMonthWise}>
            DOWNLOAD
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const mapStateToProps = (state) => ({
  attendanceBatch: getAttendanceBatch(state),
  clientUserId: getClientUserId(state),
  clientId: getClientId(state),
  currentbranding: getCurrentBranding(state),
});

const mapDispatchToProps = (dispatch) => {
  return {
    setAttendanceSelectedDateToStore: (payload) => {
      dispatch(attendanceActions.setAttendanceSelectedDateToStore(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AttendanceBatch);

AttendanceBatch.propTypes = {
  attendanceBatch: PropTypes.instanceOf(Object).isRequired,
  setAttendanceSelectedDateToStore: PropTypes.func.isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  clientUserId: PropTypes.number.isRequired,
  clientId: PropTypes.number.isRequired,
  currentbranding: PropTypes.instanceOf(Object).isRequired,
};
