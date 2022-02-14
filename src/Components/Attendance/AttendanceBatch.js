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
import { PageHeader } from '../Common';
import PreviousAttendance from './PreviousAttendance';
import TakeAttendance from './TakeAttendance';
import 'react-calendar/dist/Calendar.css';
import './attendance.css';

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
  const [showModal1, setShowModal1] = useState(false);
  const [date, setDate] = useState(new Date());
  const [students, setStudents] = useState([]);
  const [attendanceDate, setAttendanceDate] = useState('');
  const [submitStatus, setSubmitStatus] = useState(0);
  const [swiper, setSwiper] = useState(null);
  const [checked, setChecked] = useState(false);

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

  const handleOpen1 = () => setShowModal1(true);

  const handleClose1 = () => setShowModal1(false);

  // const downloader = () => {
  //   handleClose1();
  // };
  const onCheck = () => {
    setChecked(!checked);
  };

  const selectMonth = () => {
    handleOpen1();
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

  const theMonths = [
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
  console.log(theMonths);
  // const d = new Date();
  // const monthCur = d.getMonth().toLocaleString('default', { month: 'long' });
  // const currentMonth = d.toLocaleString('default', { month: 'long' });
  // // console.log(currentMonth);
  // const year = d.getFullYear();
  // const yearBack = year - 1;
  // console.log(yearBack);
  // console.log(monthCur);

  // const month1 = d.toLocaleString('default', { month: 'long' });
  // d.setMonth(d.getMonth() - 1);
  // const month2 = d.toLocaleString('default', { month: 'long' });
  // d.setMonth(d.getMonth() - 1);
  // const month3 = d.toLocaleString('default', { month: 'long' });
  // d.setMonth(d.getMonth() - 1);
  // const month4 = d.toLocaleString('default', { month: 'long' });
  // d.setMonth(d.getMonth() - 1);
  // const month5 = d.toLocaleString('default', { month: 'long' });
  // d.setMonth(d.getMonth() - 1);
  // const month6 = d.toLocaleString('default', { month: 'long' });
  // d.setMonth(d.getMonth() - 1);
  // const month7 = d.toLocaleString('default', { month: 'long' });
  // d.setMonth(d.getMonth() - 1);
  // const month8 = d.toLocaleString('default', { month: 'long' });
  // d.setMonth(d.getMonth() - 1);
  // const month9 = d.toLocaleString('default', { month: 'long' });
  // d.setMonth(d.getMonth() - 1);
  // const month10 = d.toLocaleString('default', { month: 'long' });
  // d.setMonth(d.getMonth() - 1);
  // const month11 = d.toLocaleString('default', { month: 'long' });
  // d.setMonth(d.getMonth() - 1);
  // const month12 = d.toLocaleString('default', { month: 'long' });

  return (
    <>
      <PageHeader
        title={attendanceBatch.batch_name}
        customIcon2={<DateRangeIcon />}
        handleCustomIcon2={changeDate}
        customIcon={<DownloadIcon />}
        handleCustomIcon={selectMonth}
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
      <Modal show={showModal1} onHide={handleClose1} centered>
        <Modal.Header closeButton1>
          <Modal.Title style={{ color: '#0BA8E6', marginBottom: '-18px' }}>
            Select The Duration
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Col>
            {theMonths.map((e) => {
              return (
                <Row className='monthStyle'>
                  <Col>
                    {/* onClick={(el) => setCheck(!check, el.target.name)} */}
                    {e}
                  </Col>
                  <Col>{/* <CheckIcon /> */}</Col>
                </Row>
              );
            })}
            {/* <Row className='buttonStyle'>
              <h6>
                {month1}-{year}
              </h6>
            </Row>
            <Row className='buttonStyle'>
              <h6>
                {month2}-{year}
              </h6>
            </Row>
            <Row className='buttonStyle'>
              <h6>
                {month3}-{month3 === 'December' ? year-1 : year}
              </h6>
            </Row>
            <Row className='buttonStyle'>
              <h6>
                {month4}-{currentMonth === month4 || month4 > monthCur ? year : year - 1}
              </h6>
            </Row>
            <Row className='buttonStyle'>
              <h6>
                {month5}-{currentMonth === month5 || month5 > monthCur ? year : year - 1}
              </h6>
            </Row>
            <Row className='buttonStyle'>
              <h6>
                {month6}-{currentMonth === month6 || month6 > monthCur ? year : year - 1}
              </h6>
            </Row>
            <Row className='buttonStyle'>
              <h6>
                {month7}-{currentMonth === month7 || month7 > monthCur ? year : year - 1}
              </h6>
            </Row>
            <Row className='buttonStyle'>
              <h6>
                {month8}-{currentMonth === month8 || month8 > monthCur ? year : year - 1}
              </h6>
            </Row>
            <Row className='buttonStyle'>
              <h6>
                {month9}-{currentMonth === month9 || month9 > monthCur ? year : year - 1}
              </h6>
            </Row>
            <Row className='buttonStyle'>
              <h6>
                {month10}-{currentMonth === month10 || month10 > monthCur ? year : year - 1}
              </h6>
            </Row>
            <Row className='buttonStyle'>
              <h6>
                {month11}-{currentMonth === month11 || month11 > monthCur ? year : year - 1}
              </h6>
            </Row>
            <Row style={{ paddingLeft: '10px', paddingTop: '5px' }}>
              <h6>
                {month12}-{currentMonth === month12 || month12 > monthCur ? year : year - 1}
              </h6>
            </Row> */}
          </Col>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='boldText' onClick={() => handleClose1()}>
            CANCEL
          </Button>
          <Button variant='boldText' onClick={() => download()}>
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
