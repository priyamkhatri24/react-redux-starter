/** @jsxImportSource @emotion/react */

import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import GetAppIcon from '@material-ui/icons/GetApp';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import InfiniteScroll from 'react-infinite-scroll-component';
import BatchesDataCard from './BatchesDataCard';
import UserDataCard from './UsersDataCard';
import { PageHeader, AlertSlideup } from '../Common';
import BottomNavigation from '../Common/BottomNavigation/BottomNavigation';
import AddButton from '../Common/AddButton/AddButton';
import FilterAccordion from '../Common/FilterAccordion/FilterAccordion';
import { getClientId, getClientUserId } from '../../redux/reducers/clientUserId.reducer';
import { apiValidation, get, json2xlsDownload } from '../../Utilities';
import { admissionActions } from '../../redux/actions/admissions.action';
import AdmissionStyle from './Admissions.style';
import './Admissions.scss';

const Admissions = (props) => {
  const { clientId, clientUserId, history, setAdmissionRoleArrayToStore } = props;
  const [searchString, setSearchString] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [filters, setFilters] = useState({});
  const [batches, setBatches] = useState([]);
  const [isToggle, setToggle] = useState(0);
  const [tab, setTab] = useState('Users');
  const [users, setUsers] = useState([]);
  const [batchModal, setBatchModal] = useState(false);
  const [userNextPage, setUserNextPage] = useState(1);
  const [userCaller, setUserCaller] = useState(1);
  const [batchesCaller, setBatchesCaller] = useState(1);
  const [batchNextPage, setBatchNextPage] = useState(1);
  const [usersTotalCount, setUsersTotalCount] = useState(0);
  const [batchesTotalCount, setBatchesTotalCount] = useState(0);
  const handleOpen = () => setBatchModal(true);
  const handleClose = () => setBatchModal(false);
  const [optionsModal, setOptionsModal] = useState(false);
  const overlayRef = useRef(null);
  const openOptionsModal = () => {
    handleClose();
    setOptionsModal(true);
  };
  const closeOptionsModal = () => setOptionsModal(false);

  const [filterPayload, setFilterPayload] = useState({
    class_id: null,
    client_id: clientId,
    client_user_id: clientUserId,
    status: null,
    client_batch_id: null,
    role_id: null,
    page: 1,
  });

  const [batchesPayload, setBatchesPayload] = useState({
    class_id: null,
    client_id: clientId,
    client_user_id: clientUserId,
    subject_id: null,
    page: 1,
  });

  const infiniteScroll = () => {
    if (
      overlayRef?.current?.clientHeight + overlayRef?.current?.scrollTop >=
      overlayRef?.current?.scrollHeight - 200
    ) {
      if (tab === 'Users') {
        setUserCaller((prev) => prev + 1);
      }
      if (tab === 'Batches') {
        setBatchesCaller((prev) => prev + 1);
      }
    }
  };

  useEffect(() => {
    if (overlayRef && overlayRef?.current) {
      overlayRef.current.addEventListener('scroll', infiniteScroll);
    }

    return () => overlayRef?.current?.removeEventListener('scroll', infiniteScroll);
  }, [tab]);

  useEffect(() => {
    get({ client_id: clientId }, '/getFilters').then((res) => {
      const result = apiValidation(res);
      console.log(result);
      setFilters(result);
    });
  }, [clientId]);

  useEffect(() => {
    // setIsLoading(true);
    const payload = { ...batchesPayload };
    payload.page = batchNextPage;
    console.log(payload, 'payload');
    let timer;
    if (searchString.length > 0 && batchNextPage) {
      timer = setTimeout(() => {
        payload.keyword = searchString;
        get(payload, '/searchBatchesInAdmission').then((res) => {
          console.log(res, 'searchBatchesInAdmission');
          const result = apiValidation(res);
          // const searchedArray = [...batches, ...result].filter(
          //   (e) => e.batch_name.toLowerCase().indexOf(searchString.toLowerCase()) > -1,
          // );
          const searchedArray = [...batches, ...result];

          setBatchNextPage(res?.next?.page);
          setBatchesTotalCount(res.count);
          setBatches(searchedArray);
          setIsLoading(false);
        });
      }, 500);
    }
    if (searchString.length === 0 && batchNextPage) {
      get(payload, '/getBatchesUsingFilter2').then((res) => {
        console.log(res, 'getBatchesUsingFilter2');
        const result = apiValidation(res);
        // const searchedArray = [...batches, ...result].filter(
        //   (e) => e.batch_name.toLowerCase().indexOf(searchString.toLowerCase()) > -1,
        // );
        const searchedArray = [...batches, ...result];
        setBatchesTotalCount(res.count);
        setBatchNextPage(res?.next?.page);
        setBatches(searchedArray);
        setIsLoading(false);
      });
    }
    return () => {
      clearTimeout(timer);
    };
  }, [batchesPayload, batchesCaller, searchString]);

  useEffect(() => {
    // setIsLoading(true);
    const payload = { ...filterPayload };
    payload.page = userNextPage;
    console.log(payload, 'payload');
    let timer;
    if (searchString.length > 0 && userNextPage) {
      timer = setTimeout(() => {
        payload.keyword = searchString;
        get(payload, '/searchUserInAdmission').then((res) => {
          console.log(res, 'searchUserInAdmission');
          const result = apiValidation(res);
          // const searchedArray = [...users, ...result].filter(
          //   (e) =>
          //     e.first_name.toLowerCase().indexOf(searchString.toLowerCase()) > -1 ||
          //     e.last_name.toLowerCase().indexOf(searchString.toLowerCase()) > -1,
          // );
          const searchedArray = [...users, ...result];
          setUsersTotalCount(res.count);
          setUserNextPage(res?.next?.page);
          setUsers(searchedArray);
          setIsLoading(false);
        });
      }, 500);
    }
    if (searchString.length === 0 && userNextPage) {
      get(payload, '/getUsersUsingFilter3').then((res) => {
        console.log(res, 'getUsersUsingFilter3');
        const result = apiValidation(res);
        // const searchedArray = [...users, ...result].filter(
        //   (e) =>
        //     e.first_name.toLowerCase().indexOf(searchString.toLowerCase()) > -1 ||
        //     e.last_name.toLowerCase().indexOf(searchString.toLowerCase()) > -1,
        // );
        const searchedArray = [...users, ...result];
        setUsersTotalCount(res.count);
        setUserNextPage(res?.next?.page);
        setUsers(searchedArray);
        setIsLoading(false);
      });
    }

    return () => {
      clearTimeout(timer);
    };
  }, [filterPayload, userCaller, searchString]);

  const addFilter = (type, id) => {
    setUserNextPage(1);
    setUsers([]);
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
    setUserNextPage(1);
    setUsers([]);
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
    setBatchNextPage(1);
    setBatches([]);
    const updatedPayload =
      type === 'subject'
        ? { ...batchesPayload, subject_id: id }
        : { ...batchesPayload, class_id: id };

    setBatchesPayload(updatedPayload);
  };

  const removeBatchFilter = (type) => {
    setBatchNextPage(1);
    setBatches([]);
    const updatedPayload =
      type === 'subject'
        ? { ...batchesPayload, subject_id: null }
        : { ...batchesPayload, class_id: null };

    setBatchesPayload(updatedPayload);
  };

  const searchUsers = (search) => {
    setSearchString(search);
    if (!search) {
      overlayRef.current.scrollTop = 0;
    }
    setBatchNextPage(1);
    setUserNextPage(1);
    setBatches([]);
    setUsers([]);
  };

  const isFilterTriggered = () => {
    setToggle((e) => e + 1);
  };

  const changeTab = (option) => {
    setTab(option);
    overlayRef.current.scrollTop = 0;
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

  const downloadDataIntoXLS = () => {
    setIsDownloading(true);
    if (tab === 'Users') {
      const payload = { ...filterPayload };
      get(payload, '/getUsersUsingFilter').then((res) => {
        const result = apiValidation(res);
        const dataToDownload = result.map((data, index) => {
          return {
            SNo: index + 1,
            FirstName: data.first_name,
            LastName: data.last_name,
            Gender: data.gender,
            CountryCode: data.country_code,
            Contact: data.contact,
            Email: data.email,
            Address: data.address,
            Parents_contact: data.parent_contact,
          };
        });
        console.log('download result:', dataToDownload);
        json2xlsDownload(JSON.stringify(dataToDownload), 'UsersInAdmission', true);
        setTimeout(() => {
          setIsDownloading(false);
        }, 500);
      });
    } else if (tab === 'Batches') {
      console.log('batches d');
      const payload = { ...batchesPayload };
      get(payload, '/getBatchesUsingFilter').then((res) => {
        const result = apiValidation(res);
        const dataToDownload = result.map((data, index) => {
          return {
            SNo: index + 1,
            BatchName: data.batch_name,
            Description: data.description,
            Number_Of_Students: data.number_of_students,
          };
        });
        console.log('download result:', dataToDownload);
        json2xlsDownload(JSON.stringify(dataToDownload), 'BatchesInAdmission', true);
        setTimeout(() => {
          setIsDownloading(false);
        }, 500);
      });
    }
  };

  return (
    <>
      <AddButton onlyUseButton triggerButton={handleOpen} />
      <AlertSlideup trigger={isDownloading} alertText='Preparing your download. Please wait...' />
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
        <div ref={overlayRef} css={AdmissionStyle.overlayNonScroll} style={{ marginTop: '1rem' }}>
          <hr css={AdmissionStyle.horizonatalLine} />
          <Row css={AdmissionStyle.amount}>
            <span className='mr-1'>{tab === 'Users' ? usersTotalCount : batchesTotalCount} </span>{' '}
            Results
            <span className='ml-auto'>
              <GetAppIcon style={{ cursor: 'pointer' }} onClick={downloadDataIntoXLS} />
            </span>
          </Row>
          <div css={AdmissionStyle.UserCards} style={{ marginBottom: '6rem' }}>
            <InfiniteScroll
              dataLength={tab === 'Users' ? users.length : batches.length}
              next={infiniteScroll}
              hasMore
              height='calc(90vh - 175px)'
              loader={<h4 />}
            >
              {tab === 'Users' ? (
                users.length > 0 && !isLoading ? (
                  users.map((elem) => {
                    return (
                      <UserDataCard
                        elem={elem}
                        history={history}
                        key={elem.user_id * Math.random()}
                      />
                    );
                  })
                ) : users.length === 0 && !isLoading ? (
                  <div className='w-100 text-center m-auto'>
                    <p style={{ fontFamily: 'Montserrat-Medium' }}>No matching results</p>
                  </div>
                ) : isLoading ? (
                  <div className='w-100 text-center m-auto'>
                    <Spinner animation='border' role='status'>
                      <span className='d-none'>Loading...</span>
                    </Spinner>
                  </div>
                ) : null
              ) : (
                <Row className='justify-content-center mx-1'>
                  {batches.length > 0 && !isLoading ? (
                    batches.map((elem) => {
                      return (
                        <BatchesDataCard elem={elem} history={history} key={elem.client_batch_id} />
                      );
                    })
                  ) : batches.length === 0 && !isLoading ? (
                    <div className='w-100 text-center m-auto'>
                      <p style={{ fontFamily: 'Montserrat-Medium' }}>No matching results</p>
                    </div>
                  ) : isLoading ? (
                    <div className='w-100 text-center m-auto'>
                      <Spinner animation='border' role='status'>
                        <span className='d-none'>Loading...</span>
                      </Spinner>
                    </div>
                  ) : null}
                </Row>
              )}
            </InfiniteScroll>
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
  clientUserId: getClientUserId(state),
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
  clientUserId: PropTypes.number.isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  setAdmissionRoleArrayToStore: PropTypes.func.isRequired,
};
