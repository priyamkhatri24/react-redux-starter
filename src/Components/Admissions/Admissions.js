import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import GetAppIcon from '@material-ui/icons/GetApp';
import Button from 'react-bootstrap/Button';
import BatchesDataCard from './BatchesDataCard';
import UserDataCard from './UsersDataCard';
import { PageHeader, FilterAccordion, AddButton } from '../Common';
import { getClientId } from '../../redux/reducers/clientUserId.reducer';
import { apiValidation, get } from '../../Utilities';
import './Admissions.scss';

const Admissions = (props) => {
  const { clientId, history } = props;
  const [searchString, setSearchString] = useState('');
  const [filters, setFilters] = useState({});
  const [batches, setBatches] = useState([]);
  const [isToggle, setToggle] = useState(0);
  const [tab, setTab] = useState('Users');
  const [users, setUsers] = useState([]);
  const [batchModal, setBatchModal] = useState(false);
  const handleOpen = () => setBatchModal(true);
  const handleClose = () => setBatchModal(false);
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
            style={{ fontSize: '1rem', width: '8.4375rem', height: '2.125rem' }}
            active={tab !== 'Batches'}
            onClick={() => changeTab('Users')}
          >
            Users
          </Button>
          <Button
            variant='testBlueOnWhite '
            style={{ fontSize: '1rem', width: '8.4375rem', height: '2.125rem' }}
            active={tab !== 'Users'}
            onClick={() => changeTab('Batches')}
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
        <div className='Admission__overlay' style={{ marginTop: '1rem' }}>
          <hr className='w-25' style={{ borderTop: '5px solid rgba(0, 0, 0, 0.1)' }} />
          <Row className='m-4 Fees__amount'>
            <span className='mr-1'>{tab === 'Users' ? users.length : batches.length} </span> Results
            <span className='ml-auto'>
              <GetAppIcon />
            </span>
          </Row>
          <div style={{ height: '65vh', overflow: 'scroll' }}>
            {tab === 'Users' ? (
              users.map((elem) => {
                return <UserDataCard elem={elem} history={history} />;
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
          <Modal.Body>kgggk</Modal.Body>
        </Modal>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  clientId: getClientId(state),
});

export default connect(mapStateToProps)(Admissions);

Admissions.propTypes = {
  clientId: PropTypes.number.isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
};
