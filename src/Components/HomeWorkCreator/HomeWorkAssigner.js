import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DatePicker from 'react-datepicker';
import DurationPicker from 'react-duration-picker';
import 'react-datepicker/dist/react-datepicker.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { BatchesSelector, PageHeader } from '../Common';
import { getTestName } from '../../redux/reducers/homeworkCreator.reducer';
import {
  getClientId,
  getClientUserId,
  getRoleArray,
} from '../../redux/reducers/clientUserId.reducer';
import { get, apiValidation } from '../../Utilities';
import '../Live Classes/LiveClasses.scss';
import './HomeWorkCreator.scss';

const CustomInput = ({ value, onClick }) => (
  <Row className='m-2 justify-content-center'>
    <label htmlFor='Select Date' className='has-float-label my-auto w-100'>
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

const HomeWorkAssigner = (props) => {
  const { testName, clientId, clientUserId, roleArray } = props;
  const [currentTestName, setTestName] = useState('');
  const [batches, setBatches] = useState([]);
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [batchInputValue, setBatchInputValue] = useState('');
  const [duration, setDuration] = useState({});
  const [DurationModalOpen, setDurationModal] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [currentAssignentType, setCurrentAssignmentType] = useState('');
  const [durationValue, setDurationValue] = useState('');
  const [assignmentType, setAssignmentType] = useState([
    { id: 1, text: 'Homework', isSelected: false },
    { id: 2, text: 'Live Test', isSelected: false },
    { id: 3, text: 'Demo Test', isSelected: false },
  ]);
  const [postTo, setPostTo] = useState([
    { id: 1, text: 'In App', isSelected: false },
    { id: 2, text: 'Welcome', isSelected: false },
  ]);

  useEffect(() => {
    setTestName(testName);
    if (roleArray.includes(4)) {
      get({ client_id: clientId }, '/getAllBatchesOfCoaching').then((res) => {
        const result = apiValidation(res);
        setBatches(result);
      });
    } else {
      get({ client_user_id: clientUserId }, '/getBatchesOfTeacher').then((res) => {
        const result = apiValidation(res);
        setBatches(result);
      });
    }
  }, [testName, clientId, roleArray, clientUserId]);

  const handleClose = () => setShowModal(false);

  const getSelectedBatches = (payload) => {
    // const { selectedBatches } = this.state;
    setSelectedBatches(payload);
    const extraBatchesString = payload.length > 1 ? ` +${(payload.length - 2).toString()}` : '';
    if (payload.length) {
      const inputString = payload.reduce((acc, elem, index) => {
        if (index < 1) {
          return `${acc + elem.batch_name},`;
        }
        if (index === 1) {
          return acc + elem.batch_name;
        }
        return acc;
      }, '');
      if (selectedBatches.length > 0) setBatchInputValue(inputString + extraBatchesString);
      else setBatchInputValue('');
    }
  };

  const selectType = (elem) => {
    const newSubjectAraay = assignmentType.map((e) => {
      e.isSelected = false;
      if (e.id === elem) e.isSelected = !e.isSelected;
      return e;
    });
    const currentType = newSubjectAraay.filter((e) => e.isSelected === true)[0].text;
    setAssignmentType(newSubjectAraay);
    setCurrentAssignmentType(currentType);
  };

  const selectPostTo = (elem) => {
    const newSubjectAraay = postTo.map((e) => {
      e.isSelected = false;
      if (e.id === elem) e.isSelected = !e.isSelected;
      return e;
    });
    setPostTo(newSubjectAraay);
  };

  const closeDurationModal = () => {
    setDurationModal(false);
    console.log(duration);
    const durationString = `${duration.hours < 10 ? `0${duration.hours}` : duration.hours}:${
      duration.minutes < 10 ? `0${duration.minutes}` : duration.minutes
    }:${duration.seconds < 10 ? `0${duration.seconds}` : duration.seconds}`;
    setDurationValue(durationString);
  };
  return (
    <div style={{ height: '90vh' }}>
      <PageHeader title='Assign Test' />
      <Card style={{ marginTop: '5rem', padding: '1rem' }} className='mx-2 Homework__selectCard'>
        <Row className='m-2'>
          <label htmlFor='Test Name' className='has-float-label my-auto w-100'>
            <input
              className='form-control'
              name='Test Name'
              type='text'
              placeholder='Test Name'
              onChange={(e) => setTestName(e.target.value)}
              value={currentTestName}
            />
            <span>Test Name</span>
          </label>
        </Row>
        <Row className='m-2'>
          <label htmlFor='Select Batch' className='w-100 has-float-label my-auto'>
            <input
              className='form-control'
              name='Select Batch'
              type='text'
              placeholder='Select Batch'
              onClick={() => setShowModal(true)}
              readOnly
              value={batchInputValue}
            />
            <span>Select Batch</span>
            <i className='LiveClasses__show'>
              <ExpandMoreIcon />
            </i>
          </label>
        </Row>
        <Row className='m-0 justify-content-center'>
          <DatePicker
            selected={startDate}
            dateFormat='dd/MM/yyyy'
            onChange={(date) => setStartDate(date)}
            customInput={<CustomInput />}
          />
        </Row>
        <Row className='mx-2'>
          <small className='text-left Homework__smallHeading mx-3 my-2'>Assignment Type</small>
          <section className='Homework__scrollable'>
            {assignmentType.map((e) => {
              return (
                <div
                  key={e.id}
                  className={
                    e.isSelected
                      ? 'Homework__subjectBubble Homework__selected'
                      : 'Homework__subjectBubble Homework__unselected'
                  }
                  onClick={() => selectType(e.id)}
                  onKeyDown={() => selectType(e.id)}
                  role='button'
                  tabIndex='-1'
                >
                  {e.text}
                </div>
              );
            })}
          </section>
        </Row>
        {currentAssignentType === 'Live Test' && (
          <Row className='justify-content-center mt-3'>
            <Col xs={5} className='m-auto p-0'>
              <label htmlFor='Select Duration' className='w-100 has-float-label my-auto'>
                <input
                  className='form-control'
                  name='Select Duration'
                  type='text'
                  placeholder='Select Duration'
                  onClick={() => setDurationModal(true)}
                  readOnly
                  value={durationValue}
                />
                <span>Select Duration</span>
                <i className='LiveClasses__show'>
                  <ExpandMoreIcon />
                </i>
              </label>
            </Col>
            <Col xs={5} className='m-auto p-0'>
              <label className='has-float-label my-auto w-100' htmlFor='Duration'>
                <input
                  className='form-control'
                  name='Duration'
                  type='time'
                  step='1'
                  placeholder='Duration'
                  onChange={(e) => setDuration(e.target.value)}
                />
                <span className='mt-4'>Duration</span>
              </label>
            </Col>
          </Row>
        )}

        {currentAssignentType === 'Demo Test' && (
          <Row className='justify-content-center mt-3'>
            <Col xs={10} className='m-auto p-0'>
              <label htmlFor='Select Duration' className='w-100 has-float-label my-auto'>
                <input
                  className='form-control'
                  name='Select Duration'
                  type='text'
                  placeholder='Select Duration'
                  onClick={() => setDurationModal(true)}
                  readOnly
                  value={durationValue}
                />
                <span>Select Duration</span>
                <i className='LiveClasses__show'>
                  <ExpandMoreIcon />
                </i>
              </label>
            </Col>
          </Row>
        )}
        <Row className='mx-2'>
          <small className='text-left Homework__smallHeading mx-3 mb-2 mt-4'>
            Where Do You want to post this assignment
          </small>

          {postTo.map((e) => {
            return (
              <div
                key={e.id}
                className={
                  e.isSelected
                    ? 'Homework__subjectBubble Homework__selected'
                    : 'Homework__subjectBubble Homework__unselected'
                }
                onClick={() => selectPostTo(e.id)}
                onKeyDown={() => selectPostTo(e.id)}
                role='button'
                tabIndex='-1'
              >
                {e.text}
              </div>
            );
          })}
        </Row>
      </Card>
      <Row className='justify-content-center mt-4'>
        <Button variant='customPrimary'>Send</Button>
      </Row>
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Batches</Modal.Title>
        </Modal.Header>
        <BatchesSelector
          batches={batches}
          selectBatches={selectedBatches}
          getSelectedBatches={getSelectedBatches}
          title='Batches'
        />
        <Modal.Footer>
          <Button variant='dashboardBlueOnWhite' onClick={handleClose}>
            Next
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={DurationModalOpen} onHide={closeDurationModal} centered>
        <DurationPicker
          onChange={(durartion) => setDuration(durartion)}
          initialDuration={{ hours: 1, minutes: 2, seconds: 3 }}
        />
        <Modal.Footer>
          <Button variant='dashboardBlueOnWhite' onClick={closeDurationModal}>
            Next
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => ({
  testName: getTestName(state),
  clientId: getClientId(state),
  clientUserId: getClientUserId(state),
  roleArray: getRoleArray(state),
});

export default connect(mapStateToProps)(HomeWorkAssigner);

HomeWorkAssigner.propTypes = {
  testName: PropTypes.string.isRequired,
  clientId: PropTypes.number.isRequired,
  clientUserId: PropTypes.number.isRequired,
  roleArray: PropTypes.instanceOf(Array).isRequired,
};

CustomInput.propTypes = {
  value: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
};
