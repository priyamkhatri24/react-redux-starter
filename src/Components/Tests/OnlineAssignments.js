import React, { useState, useEffect, useRef } from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { get, apiValidation, post } from '../../Utilities';
import { getClientUserId } from '../../redux/reducers/clientUserId.reducer';
import { PageHeader } from '../Common/PageHeader/PageHeader';
import Homework from './HomeworkTab';
import Test from './TestTab';
import './Tests.scss';

export const OnlineAssignments = (props) => {
  const { clientUserId } = props;
  const tabRef = useRef(null);

  const [searchString, setSearchString] = useState('');
  const [key, setKey] = useState(0);
  const [tabHeight, setTabHeight] = useState(400);

  const history = useHistory();

  useEffect(() => {
    searchAssignments('');
    console.log('Rendered');
  }, [key]);

  useEffect(() => {
    if (!tabRef && !tabRef?.current) return;
    const tabHeightFromTop = document.querySelector('.t1')?.offsetTop;
    console.log(tabHeightFromTop, 'thft');
    const tabH = document.body.clientHeight - 130;
    setTabHeight(tabH);
    console.log(tabH);
  });

  const handleTabHeight = () => {
    if (!tabRef && !tabRef?.current) return;
    const tabHeightFromTop = document.querySelector('.t1')?.offsetTop;
    const tabH = document.body.clientHeight - 130;
    setTabHeight(tabH);
  };

  const searchAssignments = (search) => {
    setSearchString(search);
    // console.log(searchString);
  };

  const goToDashboard = () => {
    history.push('/');
  };

  return (
    <div style={{ height: '89vh' }} className='testContainer'>
      <PageHeader
        title='Online Assignments'
        search
        filter
        searchFilter={searchAssignments}
        // triggerFilters={() => setOpenFilterModal(true)}
        customBack
        handleBack={goToDashboard}
      />
      <Tabs
        id='controlled-tab-example'
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className='mb-3 tabs Profile__Tabs tab1'
        onClick={() => searchAssignments('')}
      >
        <Tab
          eventKey='0'
          className='tab t1 Profile__Tabs'
          id='idForONT1'
          ref={tabRef}
          style={{ height: `${tabHeight}px` }}
          onScroll={handleTabHeight}
          title='Homework'
          // onClick={() => searchAssignments('')}
        >
          <Homework clientUserId={clientUserId} searchString={searchString} />
        </Tab>
        <Tab
          eventKey='1'
          id='idForONT2'
          style={{ height: `${tabHeight}px` }}
          onScroll={handleTabHeight}
          title='Tests'
          className='tab Profile__Tabs'
          // onClick={() => searchAssignments('')}
        >
          <Test clientUserId={clientUserId} searchString={searchString} />
        </Tab>
      </Tabs>
    </div>
  );
};

const mapStateToProps = (state) => ({
  clientUserId: getClientUserId(state),
});

export default connect(mapStateToProps)(OnlineAssignments);

OnlineAssignments.propTypes = {
  clientUserId: PropTypes.number.isRequired,
};
