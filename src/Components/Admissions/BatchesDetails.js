/** @jsxImportSource @emotion/react */
import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import ReactApexCharts from 'react-apexcharts';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import format from 'date-fns/format';
import fromUnixTime from 'date-fns/fromUnixTime';
import { apiValidation, get, post } from '../../Utilities';
import AddButton from '../Common/AddButton/AddButton';
import { PageHeader } from '../Common';
import userImage from '../../assets/images/user.svg';
import UserDataCard from './UsersDataCard';
import AdmissionStyle from './Admissions.style';
import { getClientId, getClientUserId } from '../../redux/reducers/clientUserId.reducer';
import '../Dashboard/Dashboard.scss';
import './Admissions.scss';

const BatchDetails = (props) => {
  const {
    history,
    history: {
      location: {
        state: { batch },
      },
    },
    clientUserId,
    clientId,
  } = props;
  const [currentBatch, setCurrentBatch] = useState({});
  const [batchName, setBatchName] = useState('');
  const [batchNameModal, setBatchNameModal] = useState(false);
  const [currentTab, setCurrentTab] = useState('Details');
  const [batchStatusModal, setBatchStatusModal] = useState(false);

  const openBatchNameModal = () => setBatchNameModal(true);
  const closeBatchNameModal = () => setBatchNameModal(false);
  const closeBatchStatusModal = () => setBatchStatusModal(false);
  const openBatchStatusModal = () => setBatchStatusModal(true);

  const options = {
    colors: ['var(--primary-blue)', 'rgba(0, 0, 0, 0.54)'],
    chart: {
      type: 'bar',
      toolbar: {
        show: false,
      },
    },
    fill: {
      colors: ['var(--primary-blue)', 'rgba(0, 0, 0, 0.54)'],
    },
    grid: { show: false },

    plotOptions: {
      bar: {
        horizontal: true,
        distributed: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: ['Active', 'Inactive'],
    },
  };

  useEffect(() => {
    console.log(batch);

    get({ client_batch_id: batch.client_batch_id }, '/getBatchDetails').then((res) => {
      console.log(res);
      const result = apiValidation(res);
      setCurrentBatch(result);
    });
  }, [batch]);

  const changeBatchName = () => {
    post(
      { batch_id: currentBatch.batch.client_batch_id, batch_name: batchName },
      '/EditBatch',
    ).then((res) => {
      if (res.success) {
        closeBatchNameModal();
        history.push('/admissions');
      }
    });
  };

  const deleteBatch = () => {
    const payload = {
      batch_id: currentBatch.batch.client_batch_id,
      client_id: clientId,
      client_user_id: clientUserId,
    };
    Swal.fire({
      title: 'Delete Batch',
      text: 'Do you wish to delete the Batch?',
      icon: 'question',
      confirmButtonText: `Yes`,
      showDenyButton: true,
      customClass: 'Assignments__SweetAlert',
    }).then((resp) => {
      if (resp.isConfirmed) {
        post(payload, '/deleteBatch').then((res) => {
          if (res.success) {
            history.push('/admissions');
          }
        });
      }
    });
  };

  const handleOpen = () => {
    history.push({ pathname: '/admissions/batch/addusers', state: { batch } });
  };

  const changeBatchStatus = () => {
    const payload = {
      batch_id: currentBatch.batch.client_batch_id,
      status: currentBatch.batch.batch_status === 'active' ? 'inactive' : 'active',
    };
    console.log(currentBatch, payload);
    post(payload, '/changeBatchStatus').then((res) => {
      console.log(res);
      Swal.fire({
        title: 'Success',
        text: `${currentBatch.batch.batch_name} is now an ${
          currentBatch.batch.batch_status === 'active' ? 'inactive' : 'active'
        } batch`,
        icon: 'success',
      });
      closeBatchStatusModal();
      const newCurrentBatchObj = { ...currentBatch };
      const newBatchObj = { ...newCurrentBatchObj.batch };
      newBatchObj.batch_status =
        currentBatch.batch.batch_status === 'active' ? 'inactive' : 'active';
      newCurrentBatchObj.batch = newBatchObj;
      setCurrentBatch(newCurrentBatchObj);
    });
  };

  return (
    Object.keys(currentBatch).length > 0 && (
      <div className='Profile'>
        <PageHeader shadow title={currentBatch.batch.batch_name} />
        {currentTab === 'Students' ? <AddButton onlyUseButton triggerButton={handleOpen} /> : null}
        <div style={{ marginTop: '6rem' }}>
          <Col className='text-center mb-4'>
            <img
              src={currentBatch.batch.profile_image ? currentBatch.batch.profile_image : userImage}
              width='100'
              height='100'
              alt='profile'
              className='rounded-circle'
            />
            <p className='Profile__mainName my-3'>{currentBatch.batch_name}</p>
          </Col>
          <Tabs
            defaultActiveKey='Details'
            className='Profile__Tabs'
            justify
            style={{ fontSize: '12px' }}
            onSelect={setCurrentTab}
          >
            <Tab eventKey='Details' title='Details'>
              <div
                css={AdmissionStyle.adminCard}
                className='p-2'
                style={{ position: 'relative', marginTop: '1rem' }}
              >
                <div
                  className='Batch__edit-ed text-center py-1'
                  onClick={() => openBatchNameModal()}
                  role='button'
                  onKeyDown={() => openBatchNameModal()}
                  tabIndex='-1'
                >
                  <CreateIcon />
                </div>
                <div
                  className='Batch__edit-del text-center py-1'
                  onClick={() => deleteBatch()}
                  role='button'
                  onKeyDown={() => {}}
                  tabIndex='-1'
                >
                  <DeleteIcon />
                </div>
                <div
                  className='Batch__makeActive text-center py-1'
                  onClick={() => openBatchStatusModal()}
                  role='button'
                  onKeyDown={() => {}}
                  tabIndex='-1'
                >
                  <p className='Batch__makeActiveBtnText'>
                    make {currentBatch.batch.batch_status === 'active' ? 'inactive' : 'active'}
                  </p>
                </div>

                {currentBatch.batch.batch_name && (
                  <>
                    <h6 className='Admissions__adminHeading Batch__heading mb-0'>Batch Name</h6>
                    <p className='Admissions__adminDuration Batch__details'>
                      {currentBatch.batch.batch_name}
                    </p>
                  </>
                )}

                {currentBatch.batch.class && (
                  <>
                    <h6 className='Admissions__adminHeading Batch__heading mb-0'>Class</h6>
                    <p className='Admissions__adminDuration Batch__details '>
                      {currentBatch.batch.class}
                    </p>
                  </>
                )}
                {currentBatch.batch.subject.length > 0 && (
                  <>
                    <h6 className='Admissions__adminHeading Batch__heading mb-0'>Subject</h6>
                    <p className='Admissions__adminDuration Batch__details '>
                      {currentBatch.batch.subject.map((e, i) => {
                        return (
                          <span key={e.subject_id}>
                            <span>{e.subject_name}</span>
                            {i !== currentBatch.batch.subject.length - 1 && <span>,</span>}
                          </span>
                        );
                      })}
                    </p>
                  </>
                )}

                {currentBatch.batch.created_by && (
                  <>
                    <h6 className='Admissions__adminHeading Batch__heading mb-0'>Created By</h6>
                    <p className='Admissions__adminDuration Batch__details '>
                      {currentBatch.batch.created_by}
                    </p>
                  </>
                )}

                {currentBatch.batch.created_at && (
                  <>
                    <h6 className='Admissions__adminHeading Batch__heading mb-0'>Created On</h6>
                    <p className='Admissions__adminDuration Batch__details '>
                      {format(
                        fromUnixTime(parseInt(currentBatch.batch.created_at, 10)),
                        'dd MMM yyyy',
                      )}
                    </p>
                  </>
                )}

                {currentBatch.batch.session_end_date && (
                  <>
                    <h6 className='Admissions__adminHeading Batch__heading mb-0'>
                      Session Ends On
                    </h6>
                    <p className='Admissions__adminDuration Batch__details '>
                      {format(
                        fromUnixTime(parseInt(currentBatch.batch.session_end_date / 1000, 10)),
                        'dd MMM yyyy',
                      )}
                    </p>
                  </>
                )}
                {currentBatch.batch.description && (
                  <>
                    <h6 className='Admissions__adminHeading Batch__heading mb-0'>Description</h6>
                    <p className='Admissions__adminDuration Batch__details '>
                      {currentBatch.batch.description}
                    </p>
                  </>
                )}
              </div>
              <div className='Batch__charts'>
                {[
                  {
                    title: 'Student',
                    active: currentBatch.students.active.length,
                    pending: currentBatch.students.pending.length,
                  },
                  {
                    title: 'Teacher',
                    active: currentBatch.teachers.active.length,
                    pending: currentBatch.teachers.pending.length,
                  },
                  {
                    title: 'Admin',
                    active: currentBatch.admins.active.length,
                    pending: currentBatch.admins.pending.length,
                  },
                ].map((elem) => {
                  const series = [
                    {
                      data: [elem.active, elem.pending],
                    },
                  ];
                  return (
                    <Card key={elem.title} className='my-3'>
                      <Row className='p-2 react_chart'>
                        {/* react-chart is from dashboard.scss */}
                        <Col xs={4} className='text-center p-2 my-auto'>
                          <p
                            className='Dashboard__attendanceSubHeading'
                            style={{ fontFamily: 'Montserrat-SemiBold' }}
                          >
                            {elem.title}
                          </p>
                          <p className='Dashboard__admissionsBlueText my-auto'>
                            {elem.pending + elem.active}
                          </p>
                        </Col>
                        <Col xs={8}>
                          <ReactApexCharts options={options} series={series} type='bar' />
                        </Col>
                      </Row>
                    </Card>
                  );
                })}
              </div>
            </Tab>
            <Tab eventKey='Students' title='Students' className='Batch__students'>
              {currentBatch.students.active.map((elem) => {
                return <UserDataCard elem={elem} history={history} />;
              })}
              {currentBatch.students.pending.map((elem) => {
                return <UserDataCard elem={elem} history={history} />;
              })}
            </Tab>
            <Tab eventKey='Teachers' title='Teachers' className='Batch__students'>
              {currentBatch.teachers.active.map((elem) => {
                return <UserDataCard elem={elem} history={history} />;
              })}
              {currentBatch.teachers.pending.map((elem) => {
                return <UserDataCard elem={elem} history={history} />;
              })}
            </Tab>
            <Tab eventKey='Admins' title='Admins' className='Batch__students'>
              {currentBatch.admins.active.map((elem) => {
                return <UserDataCard elem={elem} history={history} />;
              })}
              {currentBatch.admins.pending.map((elem) => {
                return <UserDataCard elem={elem} history={history} />;
              })}
            </Tab>
          </Tabs>
        </div>
        <Modal show={batchNameModal} centered onHide={closeBatchNameModal}>
          <Modal.Header closeButton>
            <span className='Scrollable__courseCardHeading my-auto' style={{ fontSize: '14px' }}>
              Change Batch Name
            </span>
          </Modal.Header>
          <Modal.Body>
            <Row className='mx-2'>
              <label className='has-float-label my-auto w-100'>
                <input
                  className='form-control'
                  name='Batch Name'
                  type='text'
                  placeholder='Batch Name'
                  onChange={(e) => setBatchName(e.target.value)}
                  value={batchName}
                />
                <span>Batch Name</span>
              </label>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='boldTextSecondary' onClick={() => closeBatchNameModal()}>
              Cancel
            </Button>
            <Button variant='boldText' onClick={() => changeBatchName()}>
              Update
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={batchStatusModal} centered onHide={closeBatchStatusModal}>
          <Modal.Body>
            <Row className='mx-2'>
              <p style={{ fontFamily: 'Montserrat-Regular' }}>
                Are you sure you want to change `{currentBatch.batch.batch_name}` batch&apos;s
                status to {currentBatch.batch.batch_status === 'active' ? 'inactive' : 'active'}{' '}
                batch?
              </p>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='boldTextSecondary' onClick={closeBatchStatusModal}>
              Cancel
            </Button>
            <Button variant='boldText' onClick={changeBatchStatus}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  );
};

const mapStateToProps = (state) => ({
  clientId: getClientId(state),
  clientUserId: getClientUserId(state),
});

export default connect(mapStateToProps)(BatchDetails);

BatchDetails.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
  clientId: PropTypes.number.isRequired,
  clientUserId: PropTypes.number.isRequired,
};
