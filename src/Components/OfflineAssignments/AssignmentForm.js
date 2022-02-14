import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes, { string } from 'prop-types';
import { useHistory } from 'react-router-dom';
import { Row, Col, Container, Button, Form, Modal } from 'react-bootstrap';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { get, apiValidation, post } from '../../Utilities';
import { getClientUserId, getClientId } from '../../redux/reducers/clientUserId.reducer';
/* eslint import/no-cycle: [2, { maxDepth: 1 }] */
import { BatchesSelector } from '../Common';
import { PageHeader } from '../Common/PageHeader/PageHeader';
import './OfflineAssignments.scss';

const AssignmentForm = (props) => {
  const { clientUserId, clientId } = props;
  // const [searchString, setSearchString] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [selectSubject, setSelectsubject] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [batches, setBatches] = useState([]);
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [batchInputValue, setBatchInputValue] = useState('');
  const [assignmentName, setAssignmentName] = useState('');
  const [assignmentDate, setAssignmentDate] = useState('');
  const [batchVal, setBatchVal] = useState('');
  const [totalMarks, setTotalMarks] = useState();
  const [description, setDescription] = useState('');
  const [activeButton, setActiveButton] = useState('no');
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [formdata, setFormData] = useState({
    assignmentName: '',
    assignmentDate: '',
    description: '',
    batches: [],
    totalMarks: 0,
    subjectMarks: [],
  });
  const history = useHistory();

  useEffect(() => {
    const payload = {
      client_user_id: clientUserId,
      client_id: clientId,
    };
    get(payload, '/getSubjects').then((res) => {
      const result = apiValidation(res);

      setSubjects(result);
      // console.log(result);
    });
  }, []);

  useEffect(() => {
    const payload = {
      client_user_id: clientUserId,
      client_id: clientId,
    };
    get(payload, '/getFilters').then((res) => {
      const result = apiValidation(res);

      setBatches(result.batch);
      // console.log(result.batch);
    });
  }, []);

  useEffect(() => {
    console.log(formdata);
  }, [formdata]);

  useEffect(() => {
    const temp = selectedBatches.map((i) => {
      return i.batch_name;
    });
    setBatchVal(temp.toString());
  }, [selectedBatches]);

  const formValidator = () => {
    if (activeButton === 'no') {
      if (!assignmentName || !assignmentDate || !totalMarks || !selectedBatches.length) {
        return false;
      }
    } else if (activeButton === 'yes') {
      if (
        !assignmentName ||
        !assignmentDate ||
        !totalMarks ||
        !selectedBatches.length ||
        !selectedSubjects.length ||
        selectedSubjects.find((ele) => ele.marks.length === 0)
      ) {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isFormValid = formValidator();
    if (!isFormValid) {
      setShowValidationErrors(true);
      return;
    }
    setFormData({
      assignmentName,
      assignmentDate,
      description,
      batches: selectedBatches,
      totalMarks,
      subjectMarks: selectedSubjects,
    });

    const payload = {
      test_details: description,
      test_date: assignmentDate.split('-').reverse().join('-'),
      test_name: assignmentName,
      total_marks: totalMarks,
      subject_array: JSON.stringify(selectedSubjects),
      batch_array: JSON.stringify(selectedBatches.map((b) => b.client_batch_id)),
      teacher_id: clientUserId,
    };
    console.log(payload);
    post(payload, '/addOfflineTest').then((res) => {
      // console.log(payload);
      console.log(res);
      history.push('/offlineassignments');
    });
  };

  const goToOfflineAssignments = () => {
    history.push('/offlineassignments');
  };

  const handleSelectedSubjects = (name, id) => {
    const newSubjectArray = [...selectedSubjects];
    const isPresent = newSubjectArray.find((i) => {
      return i.subject_name === name;
    });
    // console.log(isPresent);
    if (isPresent) {
      const temp = newSubjectArray.filter((i) => {
        if (i.subject_id === id) return false;
        return true;
      });
      setSelectedSubjects(temp);
    } else {
      newSubjectArray.push({ subject_name: name, subject_id: id, marks: 0 });
      setSelectedSubjects(newSubjectArray);
    }
    // console.log(selectedSubjects);
  };

  const handleDate = (event) => {
    const date = event.target.value;
    setAssignmentDate(date);
  };

  const handleMarks = (e, id) => {
    const temp = [...selectedSubjects];
    const updatedSubjects = temp.map((i) => {
      if (i.subject_id === id) {
        i.marks = +e.target.value;
        return i;
      }
      return i;
    });

    setSelectedSubjects(updatedSubjects);

    let total = 0;
    if (selectedSubjects.length > 0) {
      selectedSubjects.forEach((i) => {
        total += parseInt(i.marks, 10);
      });
      setTotalMarks(total);
    } else {
      setTotalMarks(0);
    }

    // console.log(total);
  };

  const handleYesNo = (elem) => {
    if (elem === false) {
      setSelectedSubjects([]);
    }
    setSelectsubject(elem);
  };

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
  const findThisId = (id) => {
    const isPresent = selectedSubjects.find((i) => {
      return i.subject_id === id;
    });
    if (isPresent) return true;
    return false;
  };
  return (
    <div className='mainFormPage'>
      <PageHeader
        title='Add Offline Assignment'
        // shadow
        transparentBlue
        customBack
        handleBack={goToOfflineAssignments}
      />
      <div className='OFAFormContainer'>
        <div className='OFAForm__formContainerOffline'>
          <Row>
            <form className='OFAForm__form'>
              <label className='has-float-label my-3'>
                <input
                  className='form-control'
                  name='assignmentname'
                  type='text'
                  placeholder='Assignment name'
                  value={assignmentName}
                  onChange={(event) => setAssignmentName(event.target.value)}
                />
                <span>Assignment name</span>
                {showValidationErrors && !assignmentName && (
                  <p className='validationErrorOFAForm'>*This field is required</p>
                )}
              </label>

              <div className='d-flex'>
                {/* eslint-disable */}
                <label
                  onClick={() => setShowModal(true)}
                  htmlFor='Select Batch'
                  className='w-100 has-float-label my-auto'
                >
                  <input
                    className='form-control'
                    name='Select Batch'
                    type='text'
                    placeholder='Select Batch'
                    // onClick={() => setShowModal(true)}
                    readOnly
                    value={batchVal}
                  />
                  <span>Select Batch</span>
                  {showValidationErrors && !selectedBatches.length && (
                    <p className='validationErrorOFAForm'>*This field is required</p>
                  )}
                </label>
              </div>

              <label className='has-float-label my-3'>
                <input
                  className='form-control'
                  name='description'
                  type='text'
                  placeholder='Description (Optional)'
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
                <span>Description (Optional)</span>
              </label>

              <label className='has-float-label my-3'>
                <input
                  className='form-control'
                  name='date'
                  type='date'
                  placeholder='Assignment date'
                  value={assignmentDate}
                  onChange={(event) => handleDate(event)}
                />
                <span>Assignment date</span>
                {showValidationErrors && !assignmentDate && (
                  <p className='validationErrorOFAForm'>*This field is required</p>
                )}
              </label>
              {!selectSubject ? (
                <label className='has-float-label my-3'>
                  <input
                    className='form-control'
                    name='totalmarks'
                    type='text'
                    placeholder='Total marks'
                    value={totalMarks}
                    onChange={(event) => setTotalMarks(event.target.value)}
                  />
                  <span>Total marks</span>
                  {showValidationErrors && !totalMarks && (
                    <p className='validationErrorOFAForm'>*This field is required</p>
                  )}
                </label>
              ) : (
                <Form.Group>Total marks: {totalMarks}</Form.Group>
              )}
              <Form.Group>
                <p className='w-100 mb-0'>Do you wish to add subject-wise marks?</p>
                <div className='OFAForm__buttons'>
                  <button
                    className={`OFAForm__button ${activeButton === 'yes' && 'activeButtonOFA'}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleYesNo(true);
                      setActiveButton('yes');
                    }}
                  >
                    yes
                  </button>
                  <button
                    className={`OFAForm__button ${activeButton === 'no' && 'activeButtonOFA'}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleYesNo(false);
                      setActiveButton('no');
                    }}
                  >
                    no
                  </button>
                </div>
              </Form.Group>
              {selectSubject && (
                <div className='mb-3'>
                  <Form.Label>Select subject</Form.Label>
                  <div className='OFAForm__scrollable'>
                    {subjects.map((i) => (
                      <button
                        type='button'
                        className={`OFAForm__button mx-2${
                          findThisId(i.subject_id) ? ' activeButtonOFA' : ''
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleSelectedSubjects(i.subject_name, i.subject_id);
                        }}
                      >
                        {i.subject_name}
                      </button>
                    ))}
                  </div>
                  {showValidationErrors && !selectedSubjects.length && (
                    <p className='validationErrorOFAForm'>*This field is required</p>
                  )}
                </div>
              )}
              {selectedSubjects.length > 0 &&
                selectSubject &&
                selectedSubjects.map((i) => {
                  return (
                    <>
                      <Form.Group>
                        <Form.Control
                          type='input'
                          // value={i.subject_name}
                          placeholder={i.subject_name.concat(' total marks')}
                          className='formInput'
                          onChange={(event) => handleMarks(event, i.subject_id)}
                        />
                        {showValidationErrors && !i.marks.length && (
                          <p className='validationErrorOFAForm'>*This field is required</p>
                        )}
                      </Form.Group>
                    </>
                  );
                })}
            </form>
          </Row>
        </div>
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
      </div>
      <div className='OFAForm__buttons text-center mx-auto'>
        <button
          type='submit'
          htmlFor='OFAForm__form'
          className='OFAForm__button mt-4'
          onClick={(e) => handleSubmit(e)}
        >
          Create
        </button>
      </div>
    </div>
  );
};
const mapStateToProps = (state) => ({
  clientUserId: getClientUserId(state),
  clientId: getClientId(state),
});

export default connect(mapStateToProps)(AssignmentForm);

AssignmentForm.propTypes = {
  clientUserId: PropTypes.number.isRequired,
  clientId: PropTypes.number.isRequired,
};
