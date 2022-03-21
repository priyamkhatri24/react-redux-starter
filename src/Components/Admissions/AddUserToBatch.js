import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';
import { apiValidation, get, post } from '../../Utilities';
import { PageHeader } from '../Common';
import userImage from '../../assets/images/user.svg';
import UserDataCard from './UsersDataCard';
import { getClientId } from '../../redux/reducers/clientUserId.reducer';
import './Admissions.scss';

const AddUsersToBatch = (props) => {
  const {
    history,
    clientId,
    history: {
      location: {
        state: { batch },
      },
    },
  } = props;
  const [filterBatchId, setFilterBatchId] = useState(null);
  /* eslint-disable */
  const [batchId, setBatchId] = useState(batch?.client_batch_id);
  // const [batch, setBatch] = useState(history.location.state?.batch);
  const [students, setStudents] = useState([]);
  const [searchedStudents, setSearchedStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [currPage, setCurrPage] = useState(1);
  const [searchString, setSearchString] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStudentsArray, setSelectedStudentsArray] = useState([]);

  const searchStudents = (search) => {
    setSearchString(search);
    setCurrPage(1);
    setSearchedStudents([]);
    setStudents([]);
  };

  const infiniteScroll = () => {
    setCurrPage((prev) => prev + 1);
  };

  useEffect(() => {
    console.log(batch, 'batch id came from state');
    get({ client_id: clientId }, '/getAllBatchesOfCoaching').then((res) => {
      console.log(res);
      const result = apiValidation(res);
      setBatches(result);
    });
  }, [clientId]);

  useEffect(() => {
    setIsLoading(true);
    let timer;
    if (batchId) {
      if (searchString.length > 0) {
        timer = setTimeout(() => {
          const payload = {
            client_id: clientId,
            batch_id: batchId,
            filter_batch_id: filterBatchId,
            keyword: searchString,
            page: currPage,
          };
          get(payload, '/getAllStudentsNotInThisBatch').then((res) => {
            console.log(res);
            const result = apiValidation(res);
            console.log(result);

            setIsLoading(false);
            setSearchedStudents([...searchedStudents, ...result]);
          });
        }, 500);
      } else {
        const payload = {
          client_id: clientId,
          batch_id: batchId,
          filter_batch_id: filterBatchId,
          page: currPage,
        };
        get(payload, '/getAllStudentsNotInThisBatch').then((res) => {
          console.log(res);
          const result = apiValidation(res);
          setIsLoading(false);
          setStudents([...students, ...result]);
        });
      }
    }

    return () => {
      clearTimeout(timer);
    };
  }, [searchString, currPage, filterBatchId]);

  const updateStudentsAsPerBatch = (id) => {
    setCurrPage(1);
    setStudents([]);
    setSearchedStudents([]);
    setFilterBatchId(id);
  };

  const updateSelectedStudentsArray = (studentsClientUserId) => {
    let updatedArray = [];
    if (selectedStudentsArray.includes(studentsClientUserId)) {
      updatedArray = selectedStudentsArray.filter((elem) => elem !== studentsClientUserId);
    } else {
      updatedArray = [...selectedStudentsArray];
      updatedArray.push(studentsClientUserId);
    }
    setSelectedStudentsArray(updatedArray);
  };

  const rerenderStudents = () => {
    setIsLoading(true);
    const payload = {
      client_id: clientId,
      filter_batch_id: filterBatchId,
      batch_id: batchId,
      page: 1,
    };
    get(payload, '/getAllStudentsNotInThisBatch').then((res) => {
      const result = apiValidation(res);
      setIsLoading(false);
      setStudents(result);
    });
  };

  const addMultipleUsersToBatch = () => {
    console.log(selectedStudentsArray);
    const payload = {
      users_array: JSON.stringify(selectedStudentsArray),
      batch_id: batchId,
    };
    post(payload, '/addMultipleStudentsInBatch').then((res) => {
      console.log(res);
      Swal.fire({
        title: 'Success',
        text: `Student(s) successfully added to ${batch.batch_name}`,
        icon: 'success',
        confirmButtonText: `Ok`,
      }).then((result) => {
        if (result.isConfirmed) {
          rerenderStudents();
        }
      });
    });
  };

  return (
    <>
      <PageHeader
        search
        shadow
        title={`Add users to "${batch.batch_name}"`}
        searchFilter={searchStudents}
      />
      <div className='mx-auto' style={{ marginTop: '70px' }}>
        <h5 className='Batch__batchesheading mx-3'>Batches</h5>
        <div className='Batch__scrollingButtons mx-0'>
          {batches.map((ele) => {
            let buttonClass = 'Batch__batchNameButton';
            if (ele.client_batch_id === filterBatchId) {
              buttonClass = 'Batch__batchNameButton Batch__selectedButton';
            }
            return (
              <button
                key={ele.client_batch_id}
                onClick={() => updateStudentsAsPerBatch(ele.client_batch_id)}
                type='button'
                className={buttonClass}
              >
                {ele.batch_name}
              </button>
            );
          })}
        </div>
      </div>
      <hr
        style={{
          margin: '10px 0px',
        }}
      />
      <div className='mt-2 mx-0'>
        {batchId ? <h5 className='Batch__batchesheading mx-3 mt-2 mb-0'>Select Students</h5> : null}

        <InfiniteScroll
          dataLength={students.length}
          next={infiniteScroll}
          hasMore
          height={document.documentElement.clientHeight - 180}
          loader={<h4 />}
        >
          {batchId && isLoading ? (
            <div className='w-100 mx-auto text-center'>
              <Spinner animation='border' role='status'>
                <span className='sr-only'>Loading...</span>
              </Spinner>
            </div>
          ) : null}
          {batchId ? (
            (searchedStudents.length ? searchedStudents : students).map((elem) => {
              const isSelected = selectedStudentsArray.includes(elem.client_user_id);
              return (
                <div
                  kwy={elem.client_user_id}
                  role='button'
                  tabIndex={-1}
                  onKeyDown={() => updateSelectedStudentsArray(elem.client_user_id)}
                  onClick={() => updateSelectedStudentsArray(elem.client_user_id)}
                >
                  <UserDataCard
                    selectedCard={isSelected}
                    noRedirect
                    elem={elem}
                    history={history}
                  />
                </div>
              );
            })
          ) : (
            <p className='Batch__batchesheading text-center my-2'>
              Something went wrong. Please go back and try again.
            </p>
          )}
        </InfiniteScroll>
        {selectedStudentsArray.length > 0 && (
          <Button
            variant='customPrimaryWithShadow'
            style={{
              position: 'fixed',
              bottom: 20,
              zIndex: '10',
              left: '50%',
              transform: 'translate(-50%, 0)',
            }}
            onClick={() => addMultipleUsersToBatch()}
          >
            Add User(s)
          </Button>
        )}
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  clientId: getClientId(state),
});

export default connect(mapStateToProps)(AddUsersToBatch);

AddUsersToBatch.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
  clientId: PropTypes.number.isRequired,
  batch: PropTypes.instanceOf(Object).isRequired,
};
