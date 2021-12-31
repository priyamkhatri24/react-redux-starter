/** @jsxImportSource @emotion/react */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Row from 'react-bootstrap/Row';
import GetAppIcon from '@material-ui/icons/GetApp';
import SavedSentCard from './SavedSentTestCard';
import { PageHeader } from '../Common';
import {
  getClientId,
  getClientUserId,
  getRoleArray,
} from '../../redux/reducers/clientUserId.reducer';
import { apiValidation, get } from '../../Utilities';
import FilterAccordion from '../Common/FilterAccordion/FilterAccordion';
import AdmissionStyle from '../Admissions/Admissions.style';
import { courseActions } from '../../redux/actions/course.action';
import { homeworkActions } from '../../redux/actions/homework.action';

const SavedSentTestsUsingFilters = (props) => {
  const {
    history: { location: { state: { testsType = 'saved' } } = {} } = {},
    history,
    clientId,
    clientUserId,
    roleArray,
    setQuestionArrayToStore,
    setTestIsDraftToStore,
    setTestClassSubjectToStore,
    setCurrentChapterArrayToStore,
    setCurrentSubjectArrayToStore,
    setTestNameToStore,
    setTestIdToStore,
    setHomeworkLanguageTypeToStore,
    clearTests,
  } = props;
  const [isToggle, setToggle] = useState(0);
  const [filters, setFilters] = useState({});
  const [searchString, setSearchString] = useState('');
  const [filterPayload, setFilterPayload] = useState({
    class_id: null,
    client_id: clientId,
    client_user_id: clientUserId,
    is_admin: !!roleArray.includes(4),
    client_batch_id: null,
    assignment_type: null,
  });
  const [tests, setTests] = useState([]);

  useEffect(() => {
    get({ client_id: clientId }, '/getFilters').then((res) => {
      const result = apiValidation(res);
      result.assignment = [
        { type: 'homework', name: 'Homework' },
        { type: 'demo test', name: 'Demo Test' },
        { type: 'live test', name: 'Live Test' },
      ];
      console.log(result);
      setFilters(result);
    });
  }, [clientId]);

  const rerenderTests = () => {
    get(
      filterPayload,
      testsType === 'saved' ? '/getSavedHomeworksUsingFilters' : '/getSentAssignmentsUsingFilter',
    ).then((res) => {
      console.log(res);
      const result = apiValidation(res);
      const searchedArray = result.filter(
        (e) => e.test_name.toLowerCase().indexOf(searchString.toLowerCase()) > -1,
      );
      setTests(searchedArray);
    });
  };

  useEffect(() => {
    get(
      filterPayload,
      testsType === 'saved' ? '/getSavedHomeworksUsingFilters' : '/getSentAssignmentsUsingFilter',
    ).then((res) => {
      console.log(res);
      const result = apiValidation(res);
      const searchedArray = result.filter(
        (e) => e.test_name.toLowerCase().indexOf(searchString.toLowerCase()) > -1,
      );
      setTests(searchedArray);
    });
  }, [filterPayload, searchString, testsType]);

  const searchTests = (search) => {
    setSearchString(search);
  };

  const isFilterTriggered = () => {
    setToggle((e) => e + 1);
  };

  const handleBack = () => history.push('/');

  const addFilter = (type, id) => {
    const updatedPayload =
      type === 'role'
        ? { ...filterPayload, role_id: id }
        : type === 'status'
        ? { ...filterPayload, status: id }
        : type === 'batch'
        ? { ...filterPayload, client_batch_id: id }
        : type === 'assignment'
        ? { ...filterPayload, assignment_type: id.type }
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
        : type === 'assignment'
        ? { ...filterPayload, assignment_type: null }
        : { ...filterPayload, class_id: null };

    setFilterPayload(updatedPayload);
  };

  const getQuestions = (testId, name, language) => {
    get({ test_id: testId }, '/getTestQuestions').then((res) => {
      clearTests();
      console.log(res);
      const result = apiValidation(res);
      //    setCurrentSlide(1);
      setQuestionArrayToStore(result);
      setTestIsDraftToStore(testsType === 'saved' ? 1 : 0);
      console.log(testsType);
      setCurrentSubjectArrayToStore(res.class_subject.class_subject_array);
      setCurrentChapterArrayToStore(res.chapter_array);
      setTestNameToStore(name);
      setTestClassSubjectToStore(res.class_subject.class_subject_array);
      setTestIdToStore(testsType === 'saved' ? testId : null);
      setHomeworkLanguageTypeToStore(language);

      history.push('/homework/viewonly', { testsType });
    });
  };

  return (
    <>
      <PageHeader
        title={testsType === 'saved' ? 'Saved Tests' : 'Sent Tests'}
        placeholder='Search for test'
        search
        searchFilter={searchTests}
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
        <FilterAccordion
          filters={filters}
          isToggle={isToggle}
          currentTab={`${testsType}tests`}
          addFilter={addFilter}
          removeFilter={removeFilter}
        />
        <div css={AdmissionStyle.overlay} style={{ marginTop: '1rem' }}>
          <hr className='w-25' style={{ borderTop: '5px solid rgba(0, 0, 0, 0.1)' }} />
          <Row css={AdmissionStyle.amount} className='m-4'>
            <span className='mr-1'>{tests.length} </span> Results
            <span className='ml-auto'>
              <GetAppIcon />
            </span>
          </Row>
          <div style={{ height: '75vh', overflow: 'scroll' }}>
            {tests.map((elem) => {
              return (
                <div
                  onClick={() => getQuestions(elem.test_id, elem.test_name, elem.language_type)}
                  onKeyDown={() => getQuestions(elem.test_id, elem.test_name, elem.language_type)}
                  role='button'
                  tabIndex='-1'
                  key={elem.test_id}
                >
                  <SavedSentCard elem={elem} testsType={testsType} updateTests={rerenderTests} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  clientId: getClientId(state),
  clientUserId: getClientUserId(state),
  roleArray: getRoleArray(state),
});

const mapDispatchToProps = (dispatch) => {
  return {
    setQuestionArrayToStore: (payload) => {
      dispatch(homeworkActions.setQuestionArrayToStore(payload));
    },

    setTestIsDraftToStore: (payload) => {
      dispatch(homeworkActions.setTestIsDraftToStore(payload));
    },
    setTestClassSubjectToStore: (payload) => {
      dispatch(homeworkActions.setTestClassSubjectToStore(payload));
    },
    setTestNameToStore: (payload) => {
      dispatch(homeworkActions.setTestNameToStore(payload));
    },
    clearTests: () => {
      dispatch(homeworkActions.clearTests());
    },
    setTestIdToStore: (payload) => {
      dispatch(homeworkActions.setTestIdToStore(payload));
    },
    setHomeworkLanguageTypeToStore: (payload) => {
      dispatch(homeworkActions.setHomeworkLanguageTypeToStore(payload));
    },
    setCurrentChapterArrayToStore: (payload) => {
      dispatch(homeworkActions.setCurrentChapterArrayToStore(payload));
    },
    setCourseAddContentTestIdToStore: (payload) => {
      dispatch(courseActions.setCourseAddContentTestIdToStore(payload));
    },
    setCurrentSubjectArrayToStore: (payload) => {
      dispatch(homeworkActions.setCurrentSubjectArrayToStore(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SavedSentTestsUsingFilters);

SavedSentTestsUsingFilters.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
  clientUserId: PropTypes.number.isRequired,
  clientId: PropTypes.number.isRequired,
  roleArray: PropTypes.instanceOf(Array).isRequired,
  setQuestionArrayToStore: PropTypes.func.isRequired,
  setCurrentSubjectArrayToStore: PropTypes.func.isRequired,
  setTestIsDraftToStore: PropTypes.func.isRequired,
  setTestClassSubjectToStore: PropTypes.func.isRequired,
  setCurrentChapterArrayToStore: PropTypes.func.isRequired,
  setTestNameToStore: PropTypes.func.isRequired,
  clearTests: PropTypes.func.isRequired,
  setTestIdToStore: PropTypes.func.isRequired,
  setHomeworkLanguageTypeToStore: PropTypes.func.isRequired,
};
