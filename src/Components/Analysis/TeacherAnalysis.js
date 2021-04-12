/** @jsxImportSource @emotion/react */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import GetAppIcon from '@material-ui/icons/GetApp';
import { PageHeader } from '../Common';
import FilterAccordion from '../Common/FilterAccordion/FilterAccordion';
import { apiValidation, get } from '../../Utilities';
import { getClientId } from '../../redux/reducers/clientUserId.reducer';
import AdmissionStyle from '../Admissions/Admissions.style';
import AnalysisDataCard from './AnalysisDataCard';
import { analysisActions } from '../../redux/actions/analysis.action';

const TeacherAnalysis = (props) => {
  const { history, clientId, setAnalysisAssignmentObjectToStore } = props;
  const [searchString, setSearchString] = useState('');
  const [filters, setFilters] = useState({});
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [isToggle, setToggle] = useState(0);
  const [tab, setTab] = useState('Assignments');
  const [filterPayload, setFilterPayload] = useState({
    class_id: null,
    client_id: clientId,
    status: null,
    client_batch_id: null,
    role_id: null,
  });

  useEffect(() => {
    get({ client_id: clientId }, '/getFilters').then((res) => {
      const result = apiValidation(res);
      console.log(result);
      setFilters(result);
    });
  }, [clientId]);

  useEffect(() => {
    get(filterPayload, '/getAssignmentAnalysisUsingFilterLatest').then((res) => {
      console.log(res);
      const result = apiValidation(res);
      const searchedArray = result.filter(
        (e) => e.test_name.toLowerCase().indexOf(searchString.toLowerCase()) > -1,
      );
      setAssignments(searchedArray);
    });

    get(filterPayload, '/getOverallAnalysisUsingFilter').then((res) => {
      console.log(res);
      const result = apiValidation(res);
      const searchedArray = result.filter(
        (e) =>
          e.first_name.toLowerCase().indexOf(searchString.toLowerCase()) > -1 ||
          e.last_name.toLowerCase().indexOf(searchString.toLowerCase()) > -1,
      );
      setStudents(searchedArray);
    });
  }, [filterPayload, searchString]);

  const isFilterTriggered = () => {
    setToggle((e) => e + 1);
  };
  const searchAssignments = (search) => {
    setSearchString(search);
  };

  const changeTab = (option) => {
    setTab(option);
  };

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

  const goToDetailsOfAssignment = (elem) => {
    setAnalysisAssignmentObjectToStore(elem);
    history.push('/analysis/assignment');
  };

  const handleBack = () => history.push('/');

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
            style={{ fontSize: '1rem', width: '8.4375rem', height: '2.125rem' }}
            active={tab !== 'Students'}
            onClick={() => changeTab('Assignments')}
          >
            Assignments
          </Button>
          <Button
            variant='testBlueOnWhite '
            style={{ fontSize: '1rem', width: '8.4375rem', height: '2.125rem' }}
            active={tab !== 'Assignments'}
            onClick={() => changeTab('Students')}
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
          <Row css={AdmissionStyle.amount} className='m-4'>
            <span className='mr-1'>
              {tab === 'Assignments' ? assignments.length : students.length}{' '}
            </span>{' '}
            Results
            <span className='ml-auto'>
              <GetAppIcon />
            </span>
          </Row>
          <div style={{ height: '65vh', overflow: 'scroll' }}>
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
                  return <AnalysisDataCard elem={elem} key={elem.client_user_id} IsStudent />;
                })}
              </>
            )}
          </div>
        </div>
      </div>
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TeacherAnalysis);

TeacherAnalysis.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
  clientId: PropTypes.number.isRequired,
  setAnalysisAssignmentObjectToStore: PropTypes.func.isRequired,
};
