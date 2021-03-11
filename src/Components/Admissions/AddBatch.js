import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ScheduleIcon from '@material-ui/icons/Schedule';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import addMonths from 'date-fns/addMonths';
import addDays from 'date-fns/addDays';
import format from 'date-fns/format';
import fromUnixTime from 'date-fns/fromUnixTime';
import DatePicker from 'react-datepicker';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import 'react-datepicker/dist/react-datepicker.css';

import { PageHeader } from '../Common';
import { apiValidation, get } from '../../Utilities';
import { admissionActions } from '../../redux/actions/admissions.action';
import {
  getAdmissionBatchDate,
  getAdmissionBatchDescription,
  getAdmissionBatchName,
} from '../../redux/reducers/admissions.reducer';

const CustomInput = ({ value, onClick }) => (
  <Row className='m-2 justify-content-center'>
    <label htmlFor='Select Date' className='w-100 has-float-label my-auto'>
      <input
        className='form-control'
        name='Select Date'
        type='text'
        placeholder='Select Date'
        onClick={onClick}
        readOnly
        value={value}
      />
      <span>Select Date</span>
      <i className='LiveClasses__show'>
        <ExpandMoreIcon />
      </i>
    </label>
  </Row>
);

const AddBatch = (props) => {
  const {
    admissionBatchDate,
    admissionBatchDescription,
    admissionBatchName,
    setAdmissionBatchDateToStore,
    setAdmissionBatchDescriptionToStore,
    setAdmissionBatchNameToStore,
    history,
  } = props;
  const [batchName, setBatchName] = useState('');
  const [batchDescription, setBatchDescription] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const handleOpen = () => {
    setShowModal(true);
    setShowDate(true);
  };
  const handleClose = () => setShowModal(false);

  useEffect(() => {
    get(null, '/getTimeStamp').then((res) => {
      console.log(res);
      const result = apiValidation(res);
      setCurrentDate(fromUnixTime(parseInt(result.time_stamp, 10)));
    });
  }, []);

  useEffect(() => {
    setBatchDescription(admissionBatchDescription);
    setBatchName(admissionBatchName);
    setCurrentDate(admissionBatchDate);
  }, [admissionBatchDate, admissionBatchDescription, admissionBatchName]);

  const addMonthsToDate = (months) => {
    const newDate = addMonths(currentDate, months);
    setCurrentDate(newDate);
    handleClose();
  };

  const goToNextStage = () => {
    if (batchName === '' || batchDescription === '') setIsValid(true);
    else {
      setIsValid(false);
      setAdmissionBatchDateToStore(currentDate);
      setAdmissionBatchDescriptionToStore(batchDescription);
      setAdmissionBatchNameToStore(batchName);
      history.push({ pathname: '/admissions/add/class', state: { isBatch: true } });
    }
  };

  return (
    <>
      <PageHeader title='Add Batch' />
      <div style={{ marginTop: '5rem' }}>
        <Card className='LiveClasses__Card mx-auto p-3'>
          <Row>
            <Col xs={2}>
              <PersonOutlineIcon />
            </Col>
            <Col xs={10}>
              <label className='has-float-label my-auto'>
                <input
                  className='form-control'
                  name='Batch Name'
                  type='text'
                  placeholder='Batch Name'
                  value={batchName}
                  onChange={(e) => setBatchName(e.target.value)}
                />
                <span>Batch Name</span>
              </label>
              <label className='has-float-label my-auto mt-3'>
                <input
                  className='form-control mt-3'
                  name='Batch Description'
                  type='text'
                  placeholder='Batch Description'
                  value={batchDescription}
                  onChange={(e) => setBatchDescription(e.target.value)}
                />
                <span>Batch Description</span>
              </label>
            </Col>
          </Row>
          <Row className='mt-2'>
            <Col xs={2}>
              <ScheduleIcon />
            </Col>
            <Col xs={10} onClick={() => handleOpen()}>
              <p
                className='AddButton__menuContents'
                style={{ color: 'rgba(0, 0, 0, 0.87)', textAlign: 'left' }}
              >
                Session Ends On
              </p>
              <p className='Dashboard__attendanceSubHeading'>
                {showDate ? format(currentDate, 'dd MMM yyyy') : 'Select Date'}
              </p>
            </Col>
          </Row>
          {isValid && (
            <small className='text-danger d-block'>Please Fill all Required fields</small>
          )}
        </Card>
        <Row className='justify-content-center m-4'>
          <Button variant='customPrimary' onClick={() => goToNextStage()}>
            Next
          </Button>
        </Row>
      </div>
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Date</Modal.Title>
        </Modal.Header>
        <Modal.Body className='text-center'>
          <Row
            className='Dashboard__attendanceSubHeading justify-content-center mb-2'
            onClick={() => addMonthsToDate('12')}
          >
            {format(addMonths(currentDate, 12), 'dd MMM yyyy')} (1 year)
          </Row>

          <Row
            className='Dashboard__attendanceSubHeading justify-content-center mb-2'
            onClick={() => addMonthsToDate('6')}
          >
            {format(addMonths(currentDate, 6), 'dd MMM yyyy')} (6 months)
          </Row>

          <Row
            className='Dashboard__attendanceSubHeading justify-content-center mb-2'
            onClick={() => addMonthsToDate('3')}
          >
            {format(addMonths(currentDate, 3), 'dd MMM yyyy')} (3 months)
          </Row>

          <Button variant='boldText'>Custom</Button>
          <Row className='mx-2 justify-content-center w-100'>
            <DatePicker
              minDate={addDays(new Date(), 1)}
              selected={currentDate}
              dateFormat='dd/MM/yyyy'
              onChange={(date) => {
                setCurrentDate(date);
                handleClose();
              }}
              customInput={<CustomInput />}
            />
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='boldText' onClick={() => handleClose()}>
            Done
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const mapStateToProps = (state) => ({
  admissionBatchName: getAdmissionBatchName(state),
  admissionBatchDescription: getAdmissionBatchDescription(state),
  admissionBatchDate: getAdmissionBatchDate(state),
});

const mapDispatchToProps = (dispatch) => {
  return {
    setAdmissionBatchNameToStore: (payload) => {
      dispatch(admissionActions.setAdmissionBatchNameToStore(payload));
    },
    setAdmissionBatchDescriptionToStore: (payload) => {
      dispatch(admissionActions.setAdmissionBatchDescriptionToStore(payload));
    },
    setAdmissionBatchDateToStore: (payload) => {
      dispatch(admissionActions.setAdmissionBatchDateToStore(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddBatch);

AddBatch.propTypes = {
  setAdmissionBatchDateToStore: PropTypes.func.isRequired,
  setAdmissionBatchNameToStore: PropTypes.func.isRequired,
  setAdmissionBatchDescriptionToStore: PropTypes.func.isRequired,
  admissionBatchName: PropTypes.string.isRequired,
  admissionBatchDescription: PropTypes.string.isRequired,
  admissionBatchDate: PropTypes.instanceOf(Date).isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
};

CustomInput.propTypes = {
  value: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
};
