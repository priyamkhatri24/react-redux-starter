import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DateRangeIcon from '@material-ui/icons/DateRange';
import { Swiper, SwiperSlide } from 'swiper/react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2';
import Calendar from 'react-calendar';
import { getAttendanceBatch } from '../../redux/reducers/attendance.reducer';
import { PageHeader } from '../Common';
import PreviousAttendance from './PreviousAttendance';
import TakeAttendance from './TakeAttendance';
import 'react-calendar/dist/Calendar.css';

// Import Swiper styles
import 'swiper/swiper.min.css';
import { apiValidation, get, post } from '../../Utilities';
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
  const [date, setDate] = useState(new Date());
  const [students, setStudents] = useState([]);
  const [attendanceDate, setAttendanceDate] = useState('');
  const [submitStatus, setSubmitStatus] = useState(0);
  const [swiper, setSwiper] = useState(null);

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

  const onChange = (nextValue) => setDate(nextValue);

  const goToTheDate = () => {
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

    post(payload, '/sendAttendanceMessageToParent').then((res) => console.log(res));

    const message = `Attendance updated to ${
      type === 'P' ? 'Present' : type === 'A' ? 'Absent' : 'Late'
    } for`;

    const userArray = studentArray.map((e) => e.client_user_id);
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
        triggerSMSAndNotification(presentStudents, 'P');
        triggerSMSAndNotification(absentStudents, 'A');
        triggerSMSAndNotification(lateStudents, 'L');

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

  return (
    <>
      <PageHeader
        title={attendanceBatch.batch_name}
        customIcon={<DateRangeIcon />}
        handleCustomIcon={changeDate}
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
      <div className='d-flex justify-content-center my-2'>
        <Button variant='customPrimary' onClick={() => submitAttendance()}>
          {submitStatus ? 'Update' : 'Submit'}
        </Button>
      </div>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Date</Modal.Title>
        </Modal.Header>
        <Modal.Body className='text-center'>
          <Calendar onChange={onChange} value={date} maxDate={new Date()} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant='boldTextSecondary' onClick={() => handleClose()}>
            Cancel
          </Button>
          <Button variant='boldText' onClick={() => goToTheDate()}>
            Ok
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
