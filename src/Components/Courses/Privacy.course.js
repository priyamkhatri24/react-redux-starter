import React, { useState, useEffect, useRef } from 'react';
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
import { apiValidation, get, post, useDidMountEffect } from '../../Utilities';
import { getCourseObject } from '../../redux/reducers/course.reducer';

const Privacy = (props) => {
  const {
    setCourseCurrentSlideToStore,
    clientId,
    courseId,
    clientUserId,
    history: { push },
    courseObject,
  } = props;
  const [batches, setBatches] = useState([]);
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [courseStatus, setCourseStatus] = useState(courseObject.course_status);
  const isbatchChanged = useRef({ length: courseObject.current_batch.length, change: false });

  const handleClose = () => setShowModal(false);

  const getSelectedBatches = (allbatches, selectBatches) => {
    setSelectedBatches(selectBatches);
    setBatches(allbatches);
  };

  useEffect(() => {
    const finalBatch = courseObject.final_batch;
    const selectedBatchesPrev = courseObject.current_batch;
    setBatches(finalBatch);
    setSelectedBatches(selectedBatchesPrev);
  }, [clientId, courseObject.final_batch, courseObject.current_batch]);

  useEffect(() => {
    if (selectedBatches.length > 0 && isbatchChanged.current.length !== selectedBatches.length) {
      isbatchChanged.current.change = true;
    }
    console.log(isbatchChanged.current, selectedBatches.length, 'ksbajhsd');
  }, [selectedBatches]);

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
    if (courseObject.current_batch.length > 0 && isbatchChanged.current.change) {
      Swal.fire({
        icon: 'info',
        title: 'Batches changed',
        // eslint-disable-next-line max-len
        text: `if you have changed the batches and wish to apply your changes please go back and republish this course`,
        confirmButtonText: `Continue`,
        confirmButtonColor: 'red',
        showDenyButton: true,
        denyButtonText: `Go Back`,
        denyButtonColor: 'green',
      }).then((resp) => {
        if (resp.isConfirmed) {
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
        }
      });
    } else {
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
    }
  };

  const publishCourse = () => {
    const payload = {
      course_id: courseId,
      batch_add: JSON.stringify(selectedBatches),
      batch_remove: JSON.stringify(batches),
      client_user_id: clientUserId,
      is_public: showWelcome,
    };

    console.log(payload);

    post(payload, '/assignCourseLatest').then((res) => {
      if (res.success) {
        setCourseStatus('published');
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

    isbatchChanged.current.change = false;
  };

  const unPublishCourse = () => {
    post({ course_id: courseId }, '/unpublishCourse')
      .then((res) => {
        if (res.success) {
          setCourseStatus('completed');
          Swal.fire({
            icon: 'info',
            title: 'Unpublished!',
            text: `Your course has been successfully unpublished.`,
          });
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
              onClick={() => {
                setShowModal(true);
              }}
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
                color: 'rgba(0, 0, 0, 0.38)',
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
        <Row className='mb-3 Courses__createCourse mx-2'>
          Course Status
          <div
            className='ml-auto rounded Courses__slimButton'
            style={
              courseStatus === 'published'
                ? { background: '#00ff00' }
                : courseStatus === 'completed'
                ? { background: 'rgba(255, 0, 0, 0.87)' }
                : { background: ' rgba(0, 0, 0, 0.54)' }
            }
          >
            <span
              style={{
                fontFamily: 'Montserrat-SemiBold',
                color: 'rgba(0, 0, 0, 0.87)',
                fontSize: '10px',
              }}
              className='d-block text-center'
            >
              {courseStatus === 'published'
                ? 'Published'
                : courseStatus === 'completed'
                ? 'Unpublished'
                : 'Incomplete'}
            </span>
          </div>
        </Row>

        <Row className='m-2 w-25'>
          <Button
            variant='primaryOutline'
            onClick={courseStatus === 'published' ? () => unPublishCourse() : () => publishCourse()}
          >
            {courseStatus === 'published' ? 'Unpublish' : 'Publish'}
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
          sendBoth
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

const mapStateToProps = (state) => ({
  courseObject: getCourseObject(state),
});

const mapDispatchToProps = (dispatch) => {
  return {
    setCourseCurrentSlideToStore: (payload) => {
      dispatch(courseActions.setCourseCurrentSlideToStore(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Privacy);

Privacy.propTypes = {
  setCourseCurrentSlideToStore: PropTypes.func.isRequired,
  clientId: PropTypes.number.isRequired,
  courseId: PropTypes.number.isRequired,
  clientUserId: PropTypes.number.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  courseObject: PropTypes.instanceOf(Object).isRequired,
};
