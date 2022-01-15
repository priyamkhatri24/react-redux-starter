import React, { useState, useEffect } from 'react';
import { batch, connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { Button, Form, CloseButton, Spinner } from 'react-bootstrap';
import { get, apiValidation, post } from '../../Utilities';
import {
  getClientUserId,
  getClientId,
  getRoleArray,
} from '../../redux/reducers/clientUserId.reducer';
import { PageHeader } from '../Common/PageHeader/PageHeader';
import AddButton from '../Common/AddButton/AddButton';
import AssignmentCards from './AssignmentCards';
import './OfflineAssignments.scss';

export const OfflineAssignments = (props) => {
  const { clientUserId, clientId, roleArray } = props;
  const [allAssignments, setallAssignments] = useState([]);
  const [bottomCss, setBottom] = useState(0);
  const [searchString, setSearchString] = useState('');
  const [batcharray, setBatcharray] = useState([]);
  const [batchSelected, setBatchSelected] = useState(false);
  const [selectedBatchName, setSelectedBatchName] = useState('');
  const history = useHistory();

  useEffect(() => {
    const payload = {
      client_user_id: clientUserId,
      client_id: clientId,
      //   isAdmin: true,
    };
    if (!batchSelected) {
      get(payload, '/getOfflineTestsUsingFilter').then((res) => {
        const result = apiValidation(res);
        setallAssignments(result);
        console.log(result);
      });
    } else {
      get(payload, '/getOfflineTestsUsingFilter').then((res) => {
        const result = apiValidation(res);
        const data = result.filter((elem) => {
          return elem.batch_array.some((e) => {
            return e.includes(selectedBatchName);
          });
        });
        setallAssignments(data);
        console.log(data);
      });
    }
  }, [batchSelected]);

  useEffect(() => {
    const payload = {
      client_user_id: clientUserId,
      client_id: clientId,
      //   isAdmin: true,
    };
    let timer;
    if (searchString) {
      setBatchSelected(false);
      timer = setTimeout(() => {
        get(payload, '/getOfflineTestsUsingFilter').then((res) => {
          const result = apiValidation(res);
          const data = result.filter((elem) => {
            return elem.test_name.toLowerCase().includes(searchString);
          });
          setallAssignments(data);
          console.log(data);
        });
      }, 500);
    } else {
      setBatchSelected(false);
      get(payload, '/getOfflineTestsUsingFilter').then((res) => {
        const result = apiValidation(res);
        setallAssignments(result);
        console.log(result, 'getofflineassignmentsusingfilter');
      });
    }

    return () => {
      clearTimeout(timer);
    };
  }, [searchString]);
  useEffect(() => {
    const payload = {
      client_user_id: clientUserId,
      client_id: clientId,
    };
    get(payload, '/getFilters').then((res) => {
      const result = apiValidation(res);

      setBatcharray(result.batch);
      // console.log(result.batch);
    });
  }, []);

  const searchAssignments = (search) => {
    setSearchString(search);
    // console.log(searchString);
  };

  const goToDashboard = () => {
    history.push('/');
  };

  const statePush = (e) => {
    // history.push('/offlineassignments/studentmarks');
    history.push({
      pathname: `/offlineassignments/studentmarks`,
      state: { ...e },
    });
    // history.push({
    //   pathname: `/offlineassignments/studentmarks/studedit`,
    //   state: { subjectArray: e.subject_array, testID: e.offline_test_id },
    // });
    console.log(e);
  };

  const goToForm = () => {
    history.push('/offlineassignments/addassignment');
  };

  const triggerFilter = () => {
    if (!roleArray.includes(3) || !roleArray.includes(4)) return;
    if (bottomCss === 0) {
      setBottom(0 - 90);
    } else {
      setBottom(0);
    }
  };

  const handleClick = (e) => {
    setBatchSelected(true);
    setSelectedBatchName(e);
    console.log(e, batchSelected);
  };

  return (
    <>
      <PageHeader
        title='Offline Assignments'
        search
        filter
        triggerFilters={triggerFilter}
        searchFilter={searchAssignments}
        transparent
        customBack
        handleBack={goToDashboard}
      />

      <div
        style={{
          backgroundColor: 'rgba(241, 249, 255, 1)',
          paddingTop: '4rem',
          minHeight: '60vh',
          position: 'relative',
        }}
      >
        {bottomCss !== 0 && (
          <>
            <div className='my-0 batchesText' style={{ fontFamily: 'Montserrat-medium' }}>
              Batch
            </div>
            <div className='w-100 my-1 pb-1 pl-0'>
              {!batchSelected ? (
                <div className='batch_container scrollable'>
                  {batcharray.map((i) => {
                    return (
                      <button
                        type='button'
                        className='filterBtns'
                        onClick={() => handleClick(i.batch_name)}
                      >
                        {i.batch_name}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className='batch_container scrollable'>
                  <button type='button' className='selectedBtns'>
                    {selectedBatchName}
                  </button>
                  <CloseButton
                    className='selected_button'
                    onClick={() => setBatchSelected(false)}
                  />
                </div>
              )}
            </div>
            <hr className='h_line1' />
          </>
        )}

        <div style={{ bottom: bottomCss }} className='OFAssignments'>
          <div className='horizontalLineOFA'>
            <hr className='h_line2' />
            {allAssignments.length > 0 && (
              <div className='resultsOFA mb-2 text-left'>{allAssignments.length} Results</div>
            )}
          </div>
          <div style={{ marginTop: '5rem' }}>
            {allAssignments.length > 0 ? (
              allAssignments.map((i) => {
                return (
                  /* eslint-disable */
                  <div id={i.offline_test_id} key={i.offline_test_id} onClick={() => statePush(i)}>
                    <AssignmentCards
                      testName={i.test_name}
                      firstName={i.first_name}
                      lastName={i.last_name}
                      createdAt={i.created_at}
                      testDetails={i.test_details}
                      totalMarks={i.total_marks}
                      batchArray={i.batch_array}
                      testId={i.offline_test_id}
                    />
                  </div>
                );
              })
            ) : (
              <div className='d-flex w-100 justify-content-center m-auto'>
                {batchSelected ? (
                  <p style={{ display: 'block', textAlign: 'center' }}>No offline test available</p>
                ) : (
                  <Spinner animation='border' role='status'></Spinner>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <AddButton onlyUseButton triggerButton={goToForm} />
    </>
  );
};
const mapStateToProps = (state) => ({
  clientUserId: getClientUserId(state),
  clientId: getClientId(state),
  roleArray: getRoleArray(state),
});

export default connect(mapStateToProps)(OfflineAssignments);

OfflineAssignments.propTypes = {
  clientUserId: PropTypes.number.isRequired,
  clientId: PropTypes.number.isRequired,
  roleArray: PropTypes.instanceOf(Array).isRequired,
};
