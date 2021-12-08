/** @jsxImportSource @emotion/react */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import GetAppIcon from '@material-ui/icons/GetApp';
import Button from 'react-bootstrap/Button';
import BatchesDataCard from './BatchesDataCard';
import UserDataCard from './UsersDataCard';
import { PageHeader } from '../Common';
import BottomNavigation from '../Common/BottomNavigation/BottomNavigation';
import AddButton from '../Common/AddButton/AddButton';
import FilterAccordion from '../Common/FilterAccordion/FilterAccordion';
import { getClientId } from '../../redux/reducers/clientUserId.reducer';
import { apiValidation, get } from '../../Utilities';
import { admissionActions } from '../../redux/actions/admissions.action';
import AdmissionStyle from './Admissions.style';
import './Admissions.scss';

const Admissions = (props) => {
  const { clientId, history, setAdmissionRoleArrayToStore } = props;
  const [searchString, setSearchString] = useState('');
  const [filters, setFilters] = useState({});
  const [batches, setBatches] = useState([]);
  const [isToggle, setToggle] = useState(0);
  const [tab, setTab] = useState('Users');
  const [users, setUsers] = useState([]);
  const [batchModal, setBatchModal] = useState(false);
  const handleOpen = () => setBatchModal(true);
  const handleClose = () => setBatchModal(false);
  const [optionsModal, setOptionsModal] = useState(false);
  const openOptionsModal = () => {
    handleClose();
    setOptionsModal(true);
  };
  const closeOptionsModal = () => setOptionsModal(false);

  const [filterPayload, setFilterPayload] = useState({
    class_id: null,
    client_id: clientId,
    status: null,
    client_batch_id: null,
    role_id: null,
  });

  const [batchesPayload, setBatchesPayload] = useState({
    class_id: null,
    client_id: clientId,
    subject_id: null,
  });

  useEffect(() => {
    get({ client_id: clientId }, '/getFilters').then((res) => {
      const result = apiValidation(res);
      console.log(result);
      setFilters(result);
    });
  }, [clientId]);

  useEffect(() => {
    get(batchesPayload, '/getBatchesUsingFilter').then((res) => {
      const result = apiValidation(res);
      const searchedArray = result.filter(
        (e) => e.batch_name.toLowerCase().indexOf(searchString.toLowerCase()) > -1,
      );
      setBatches(searchedArray);
    });
  }, [batchesPayload, searchString]);

  useEffect(() => {
    get(filterPayload, '/getUsersUsingFilter').then((res) => {
      console.log(res);
      const result = apiValidation(res);
      const searchedArray = result.filter(
        (e) =>
          e.first_name.toLowerCase().indexOf(searchString.toLowerCase()) > -1 ||
          e.last_name.toLowerCase().indexOf(searchString.toLowerCase()) > -1,
      );
      setUsers(searchedArray);
    });
  }, [filterPayload, searchString]);

  const addFilter = (type, id) => {
    const updatedPayload =
      type === 'role'
        ? { ...filterPayload, role_id: id }
        : type === 'status'
        ? { ...filterPayload, status: id }
        : type === 'batch'
        ? { ...filterPayload, client_batch_id: id }
        : { ...filterPayload, class_id: id };

    setFilterPayload(updatedPayload);
  };

  const removeFilter = (type) => {
    const updatedPayload =
      type === 'role'
        ? { ...filterPayload, role_id: null }
        : type === 'status'
        ? { ...filterPayload, status: null }
        : type === 'batch'
        ? { ...filterPayload, client_batch_id: null }
        : { ...filterPayload, class_id: null };

    setFilterPayload(updatedPayload);
  };

  const addBatchFilter = (type, id) => {
    const updatedPayload =
      type === 'subject'
        ? { ...batchesPayload, subject_id: id }
        : { ...batchesPayload, class_id: id };

    setBatchesPayload(updatedPayload);
  };

  const removeBatchFilter = (type) => {
    const updatedPayload =
      type === 'subject'
        ? { ...batchesPayload, subject_id: null }
        : { ...batchesPayload, class_id: null };

    setBatchesPayload(updatedPayload);
  };

  const searchUsers = (search) => {
    setSearchString(search);
  };

  const isFilterTriggered = () => {
    setToggle((e) => e + 1);
  };

  const changeTab = (option) => {
    setTab(option);
  };

  const addDetails = (type) => {
    type === 'student'
      ? setAdmissionRoleArrayToStore(['1'])
      : type === 'teacher'
      ? setAdmissionRoleArrayToStore(['3'])
      : setAdmissionRoleArrayToStore(['4']);
    history.push({ pathname: '/admissions/add/details' });
  };

  const handleBack = () => history.push('/');

  return (
    <>
      <AddButton onlyUseButton triggerButton={handleOpen} />
      <PageHeader
        title='Admissions'
        placeholder='Search for users'
        search
        searchFilter={searchUsers}
        filter
        triggerFilters={isFilterTriggered}
        transparent
        customBack
        handleBack={handleBack}
      />
      <div
        style={{
          backgroundColor: 'rgba(241, 249, 255, 1)',
          paddingTop: '4rem',
          paddingBottom: '4rem',
          position: 'relative',
        }}
      >
        <Row className='justify-content-center'>
          <Button
            variant='testBlueOnWhite'
            active={tab !== 'Batches'}
            onClick={() => changeTab('Users')}
            css={AdmissionStyle.headerButtons}
          >
            Users
          </Button>
          <Button
            variant='testBlueOnWhite '
            active={tab !== 'Users'}
            onClick={() => changeTab('Batches')}
            css={AdmissionStyle.headerButtons}
          >
            Batches
          </Button>
        </Row>
        <FilterAccordion
          filters={filters}
          isToggle={isToggle}
          currentTab={tab}
          addFilter={addFilter}
          removeFilter={removeFilter}
          addBatchFilter={addBatchFilter}
          removeBatchFilter={removeBatchFilter}
        />
        <div css={AdmissionStyle.overlay} style={{ marginTop: '1rem' }}>
          <hr css={AdmissionStyle.horizonatalLine} />
          <Row css={AdmissionStyle.amount}>
            <span className='mr-1'>{tab === 'Users' ? users.length : batches.length} </span> Results
            <span className='ml-auto'>
              <GetAppIcon />
            </span>
          </Row>
          <div css={AdmissionStyle.UserCards} style={{ marginBottom: '9rem' }}>
            {tab === 'Users' ? (
              users.map((elem) => {
                return <UserDataCard elem={elem} history={history} key={elem.user_id} />;
              })
            ) : (
              <Row className='justify-content-center mx-1'>
                {batches.map((elem) => {
                  return <BatchesDataCard elem={elem} history={history} />;
                })}
              </Row>
            )}
          </div>
        </div>
        <Modal show={batchModal} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Add</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className='mx-2 justify-content-between'>
              <Button variant='noticeBoardPost' onClick={() => openOptionsModal()}>
                <PersonAddIcon />
                <span>Add User</span>
              </Button>
              <Button
                variant='noticeBoardPost'
                onClick={() => {
                  history.push('/admissions/add/batch');
                }}
              >
                <PersonAddIcon />
                <span className=''>Add Batch</span>
              </Button>
            </Row>
          </Modal.Body>
        </Modal>
        <Modal show={optionsModal} onHide={closeOptionsModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Select Type</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className='mx-0 justify-content-between'>
              <Button
                variant='noticeBoardPost'
                style={{ paddingRight: '10px', paddingLeft: '10px' }}
                onClick={() => addDetails('student')}
              >
                <PersonAddIcon />
                <span>Student</span>
              </Button>
              <Button
                variant='noticeBoardPost'
                style={{ paddingRight: '10px', paddingLeft: '10px' }}
                onClick={() => addDetails('teacher')}
              >
                <PersonAddIcon />
                <span className=''>Teacher</span>
              </Button>

              <Button
                style={{ paddingRight: '10px', paddingLeft: '10px' }}
                variant='noticeBoardPost'
                onClick={() => addDetails('admin')}
              >
                <PersonAddIcon />
                <span className=''>Admin</span>
              </Button>
            </Row>
          </Modal.Body>
        </Modal>
      </div>

      <BottomNavigation activeNav='admission' history={history} />
    </>
  );
};

const mapStateToProps = (state) => ({
  clientId: getClientId(state),
});

const mapDispatchToProps = (dispatch) => {
  return {
    setAdmissionRoleArrayToStore: (payload) => {
      dispatch(admissionActions.setAdmissionRoleArrayToStore(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Admissions);

Admissions.propTypes = {
  clientId: PropTypes.number.isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  setAdmissionRoleArrayToStore: PropTypes.func.isRequired,
};
