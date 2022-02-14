/** @jsxImportSource @emotion/react */

import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import GetAppIcon from '@material-ui/icons/GetApp';
import InfiniteScroll from 'react-infinite-scroll-component';
import { PageHeader } from '../Common';
import FilterAccordion from '../Common/FilterAccordion/FilterAccordion';
import { apiValidation, get } from '../../Utilities';
import { getClientId } from '../../redux/reducers/clientUserId.reducer';
import AdmissionStyle from '../Admissions/Admissions.style';
import AnalysisDataCard from './AnalysisDataCard';
import BottomNavigation from '../Common/BottomNavigation/BottomNavigation';
import { analysisActions } from '../../redux/actions/analysis.action';

const TeacherAnalysis = (props) => {
  const {
    history,
    clientId,
    setAnalysisAssignmentObjectToStore,
    setAnalysisStudentObjectToStore,
  } = props;
  const [searchString, setSearchString] = useState('');
  const [filters, setFilters] = useState({});
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [isToggle, setToggle] = useState(0);
  const [tab, setTab] = useState('Assignments');
  const [studentsNextPage, setStudentsNextPage] = useState(1);
  const [assignmentsNextPage, setAssignmentsNextPage] = useState(1);
  const [studentsCaller, setStudentsCaller] = useState(1);
  const [assignmentsCaller, setAssignmentsCaller] = useState(1);
  const analysisOverlayRef = useRef(null);

  // const infiniteScroll = () => {
  //   // console.log(filterPayload);
  //   if (
  //     analysisOverlayRef?.current?.clientHeight + analysisOverlayRef?.current?.scrollTop >=
  //     analysisOverlayRef?.current?.scrollHeight - 200
  //   ) {
  //     if (tab === 'Students') {
  //       setStudentsCaller((prev) => prev + 1);
  //     } else if (tab === 'Assignments') {
  //       setAssignmentsCaller((prev) => prev + 1);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   if (analysisOverlayRef && analysisOverlayRef?.current) {
  //     analysisOverlayRef.current.addEventListener('scroll', infiniteScroll);
  //   }

  //   return () => analysisOverlayRef?.current?.removeEventListener('scroll', infiniteScroll);
  // }, [tab]);

  const infiniteScroll = () => {
    if (tab === 'Students') {
      setStudentsCaller((prev) => prev + 1);
    } else if (tab === 'Assignments') {
      setAssignmentsCaller((prev) => prev + 1);
    }
  };

  const [filterPayload, setFilterPayload] = useState({
    // class_id: null,
    client_id: clientId,
    status: null,
    client_batch_id: null,
    role_id: null,
    page: 1,
  });

  useEffect(() => {
    get({ client_id: clientId }, '/getFilters').then((res) => {
      const result = apiValidation(res);
      console.log(result);
      setFilters(result);
    });
  }, [clientId]);

  useEffect(() => {
    const payload = { ...filterPayload };
    let timer;
    payload.page = assignmentsNextPage;
    console.log(payload);
    if (searchString.length > 0 && assignmentsNextPage) {
      timer = setTimeout(() => {
        payload.keyword = searchString;
        get(payload, '/searchAssignmentInAnalysis2').then((res) => {
          console.log(res);
          const result = apiValidation(res);
          // const searchedArray = result.filter(
          //   (e) => e.test_name.toLowerCase().indexOf(searchString.toLowerCase()) > -1,
          // );
          const searchedArray = [...assignments, ...result];
          setAssignmentsNextPage(res?.next?.page);
          setAssignments(searchedArray);
        });
      }, 500);
    }
    if (searchString.length === 0 && assignmentsNextPage) {
      get(payload, '/getAssignmentAnalysisUsingFilterLatest2').then((res) => {
        console.log(res, 'getAssignmentAnalysisUsingFilterLatest2');
        const result = apiValidation(res);
        // const searchedArray = result.filter(
        //   (e) => e.test_name.toLowerCase().indexOf(searchString.toLowerCase()) > -1,
        // );
        const searchedArray = [...assignments, ...result];
        setAssignmentsNextPage(res?.next?.page);
        setAssignments(searchedArray);
      });
    }

    return () => {
      clearTimeout(timer);
    };
  }, [filterPayload, assignmentsCaller, searchString]);

  useEffect(() => {
    const payload = { ...filterPayload };
    payload.page = studentsNextPage;
    let timer;
    console.log(payload);
    if (searchString.length > 0 && studentsNextPage) {
      timer = setTimeout(() => {
        payload.keyword = searchString;
        get(payload, '/searchUserInAnalysis2').then((res) => {
          console.log(res);
          const result = apiValidation(res);
          // const searchedArray = result.filter(
          //   (e) =>
          //     e.first_name.toLowerCase().indexOf(searchString.toLowerCase()) > -1 ||
          //     e.last_name.toLowerCase().indexOf(searchString.toLowerCase()) > -1,
          // );
          const searchedArray = [...students, ...result];
          setStudentsNextPage(res?.next?.page);
          setStudents(searchedArray);
        });
      }, 500);
    }
    if (searchString.length === 0 && studentsNextPage) {
      get(payload, '/getOverallAnalysisUsingFilter2').then((res) => {
        console.log(res, 'getOverallAnalysisUsingFilter2');
        const result = apiValidation(res);
        // const searchedArray = result.filter(
        //   (e) =>
        //     e.first_name.toLowerCase().indexOf(searchString.toLowerCase()) > -1 ||
        //     e.last_name.toLowerCase().indexOf(searchString.toLowerCase()) > -1,
        // );
        const searchedArray = [...students, ...result];
        setStudentsNextPage(res?.next?.page);
        setStudents(searchedArray);
      });
    }

    return () => {
      clearTimeout(timer);
    };
  }, [filterPayload, studentsCaller, searchString]);

  const isFilterTriggered = () => {
    setToggle((e) => e + 1);
  };
  const searchAssignments = (search) => {
    setSearchString(search);
    if (!search) analysisOverlayRef.current.scrollTop = 0;
    setAssignmentsNextPage(1);
    setStudentsNextPage(1);
    setAssignments([]);
    setStudents([]);
  };

  const changeTab = (option) => {
    setTab(option);
    analysisOverlayRef.current.scrollTop = 0;
  };

  const addFilter = (type, id) => {
    setAssignmentsNextPage(1);
    setStudentsNextPage(1);
    setAssignments([]);
    setStudents([]);
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
    setAssignmentsNextPage(1);
    setStudentsNextPage(1);
    setAssignments([]);
    setStudents([]);
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

  const goToDetailsOfAssignment = (elem) => {
    setAnalysisAssignmentObjectToStore(elem);
    history.push('/analysis/assignment');
  };

  const handleBack = () => history.push('/');

  const goToStudentDetails = (elem) => {
    setAnalysisStudentObjectToStore(elem);
    history.push('/analysis/studentlist');
  };

  return (
    <>
      <PageHeader
        title='Analysis'
        placeholder='Search for assignments'
        search
        searchFilter={searchAssignments}
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
            // style={{ fontSize: '1rem', width: '8.4375rem', height: '2.125rem' }}
            active={tab !== 'Students'}
            onClick={() => changeTab('Assignments')}
            css={AdmissionStyle.headerButtons}
          >
            Assignments
          </Button>
          <Button
            variant='testBlueOnWhite '
            // style={{ fontSize: '1rem', width: '8.4375rem', height: '2.125rem' }}
            active={tab !== 'Assignments'}
            onClick={() => changeTab('Students')}
            css={AdmissionStyle.headerButtons}
          >
            Students
          </Button>
        </Row>
        <FilterAccordion
          filters={filters}
          isToggle={isToggle}
          currentTab={tab}
          addFilter={addFilter}
          removeFilter={removeFilter}
        />
        <div css={AdmissionStyle.overlay} style={{ marginTop: '1rem' }}>
          <hr className='w-25' style={{ borderTop: '5px solid rgba(0, 0, 0, 0.1)' }} />
          <Row css={AdmissionStyle.amount}>
            <span className='mr-1'>
              {tab === 'Assignments' ? assignments.length : students.length}{' '}
            </span>{' '}
            Results
            <span className='ml-auto'>
              <GetAppIcon />
            </span>
          </Row>
          <div ref={analysisOverlayRef} style={{ height: '65vh', paddingBottom: '0rem' }}>
            <InfiniteScroll
              dataLength={tab === 'Assignments' ? assignments.length : students.length}
              next={infiniteScroll}
              hasMore
              height='calc(90vh - 155px)'
              loader={<h4 />}
            >
              {tab === 'Assignments' ? (
                assignments.map((elem) => {
                  return (
                    <AnalysisDataCard
                      elem={elem}
                      key={elem.test_id}
                      buttonClick={goToDetailsOfAssignment}
                    />
                  );
                })
              ) : (
                <>
                  {students.map((elem) => {
                    return (
                      <AnalysisDataCard
                        elem={elem}
                        key={elem.client_user_id}
                        IsStudent
                        buttonClick={goToStudentDetails}
                      />
                    );
                  })}
                </>
              )}
            </InfiniteScroll>
          </div>
        </div>
      </div>

      <BottomNavigation history={history} activeNav='analysis' />
    </>
  );
};

const mapStateToProps = (state) => ({
  clientId: getClientId(state),
});

const mapDispatchToProps = (dispatch) => {
  return {
    setAnalysisAssignmentObjectToStore: (payload) => {
      dispatch(analysisActions.setAnalysisAssignmentObjectToStore(payload));
    },
    setAnalysisStudentObjectToStore: (payload) => {
      dispatch(analysisActions.setAnalysisStudentObjectToStore(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TeacherAnalysis);

TeacherAnalysis.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
  clientId: PropTypes.number.isRequired,
  setAnalysisAssignmentObjectToStore: PropTypes.func.isRequired,
  setAnalysisStudentObjectToStore: PropTypes.func.isRequired,
};
