import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import { connect } from 'react-redux';
import Card from 'react-bootstrap/Card';
import CreateIcon from '@material-ui/icons/Create';
import Modal from 'react-bootstrap/Modal';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { courseActions } from '../../redux/actions/course.action';
import { BatchesSelector } from '../Common';
import { apiValidation, get, post } from '../../Utilities';

const Privacy = (props) => {
  const {
    setCourseCurrentSlideToStore,
    clientId,
    courseId,
    clientUserId,
    history: { push },
  } = props;
  const [batches, setBatches] = useState([]);
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const handleClose = () => setShowModal(false);

  const getSelectedBatches = (selectBatches) => {
    setSelectedBatches(selectBatches);
  };

  useEffect(() => {
    get({ client_id: clientId }, '/getAllBatchesOfCoaching').then((res) => {
      console.log(res);
      const result = apiValidation(res);
      setBatches(result);
    });
  }, [clientId]);

  const deleteTheDamnCourse = () => {
    Swal.fire({
      title: 'Delete Course',
      text: 'Do you wish to delete the Course?',
      icon: 'question',
      confirmButtonText: `Yes`,
      showDenyButton: true,
      customClass: 'Assignments__SweetAlert',
    }).then((resp) => {
      if (resp.isConfirmed) {
        post({ course_id: courseId }, '/deleteCourse')
          .then((res) => {
            if (res.success) {
              push('/courses/teachercourse');
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops!',
                text: `Unable to delete this course`,
              });
            }
          })
          .catch((e) => {
            Swal.fire({
              icon: 'error',
              title: 'Oops!',
              text: `Unable to delete this course`,
            });
          });
      }
    });
  };

  const completeCourse = () => {
    post({ course_id: courseId }, '/completeCourse')
      .then((res) => {
        if (res.success) {
          push('/courses/teachercourse');
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops!',
            text: `Unable to finish. There seems to be a problem in our servers`,
          });
        }
      })
      .catch((e) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: `Unable to finish. Please check your internet connection`,
        });
      });
  };

  const publishCourse = () => {
    const idBatches = selectedBatches.map((e) => e.client_batch_id);
    const payload = {
      course_id: courseId,
      batch_array: JSON.stringify(idBatches),
      client_user_id: clientUserId,
      is_public: showWelcome,
    };

    console.log(payload);

    post(payload, '/assignCourse').then((res) => {
      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Published!',
          text: `Your course has been successfully published.`,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: `Unable to publish. Please check your internet connection`,
        });
      }
    });
  };

  return (
    <div>
      {[
        'Basic Information',
        'Create your content',
        'Course display page',
        'Pricing and promotion',
      ].map((e, i) => {
        return (
          <Card
            className='m-2 p-2'
            style={{ boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.16)', borderRadius: '10px' }}
            onClick={() => setCourseCurrentSlideToStore(i + 1)}
            key={i} // eslint-disable-line
          >
            <Row className='my-auto Courses__createCourse mx-2'>
              <span className='Courses__coloredNumber mr-2'>{i + 1}</span>{' '}
              <span className='my-auto ml-3'>{e}</span>
              <span className='ml-auto' style={{ color: 'rgba(0, 0, 0, 0.54)' }}>
                <CreateIcon />
              </span>
            </Row>
          </Card>
        );
      })}
      <Card
        className='m-2 p-2'
        style={{ boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.16)', borderRadius: '10px' }}
      >
        <Row className='my-auto Courses__createCourse mx-2'>
          <span className='Courses__coloredNumber mr-2'>5</span>{' '}
          <span className='my-auto ml-3'>Privacy and publish</span>
        </Row>
        <p className='mt-4 mx-2 Courses__motiDetail mb-0'>Who can see your course? </p>
        <p className='mt-2 mx-2 Courses__chotiDetail'>
          Your course will show in feeds, on profile and search results. Students who are already
          enrolled will not be affected by this selection.{' '}
        </p>
        <Row className='m-2'>
          <label htmlFor='Select Batch' className='w-100 has-float-label my-auto'>
            <input
              className='form-control'
              name='Select Batch'
              type='text'
              placeholder='Select Batch'
              onClick={() => setShowModal(true)}
              readOnly
              id='noBackGroundColor'
            />
            <span>Select Batch</span>
            <i
              className='LiveClasses__show'
              style={{
                position: 'absolute',
                top: '10%',
                right: '3%',
                color: 'rgba(0, 0, 0, 0.38);',
              }}
            >
              <ExpandMoreIcon />
            </i>
          </label>
        </Row>
        <Row className='m-2 ml-4 p-2'>
          <Form.Check
            style={{ marginRight: 'auto' }}
            type='checkbox'
            label='Show On Welcome Screen'
            bsPrefix='NoticeBoard__input'
            value={showWelcome}
            onClick={() => setShowWelcome(!showWelcome)}
          />
        </Row>
        <p className='mx-2 Courses__motiDetail mb-0'>Course Status </p>
        <Row className='m-2 w-25'>
          <Button variant='primaryOutline' onClick={() => publishCourse()}>
            Publish
          </Button>
        </Row>
        <p className='mt-2 mx-2 Courses__chotiDetail'>
          Course will be visible to students only once it is published.
        </p>
        <Row className='m-2 w-25'>
          <Button variant='redOutline' onClick={() => deleteTheDamnCourse()}>
            Delete
          </Button>
        </Row>
        <p className='mt-2 mx-2 Courses__chotiDetail'>
          Courses can only be deleted before any student enrolled or after the expiry date.
        </p>
        <Row className='w-25 justify-content-end ml-auto m-2'>
          <Button variant='customPrimarySmol' onClick={() => completeCourse()}>
            Finish
          </Button>
        </Row>
      </Card>
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
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setCourseCurrentSlideToStore: (payload) => {
      dispatch(courseActions.setCourseCurrentSlideToStore(payload));
    },
  };
};

export default connect(null, mapDispatchToProps)(Privacy);

Privacy.propTypes = {
  setCourseCurrentSlideToStore: PropTypes.func.isRequired,
  clientId: PropTypes.number.isRequired,
  courseId: PropTypes.number.isRequired,
  clientUserId: PropTypes.number.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
