import React, { useState, useEffect } from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

// import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { get, apiValidation, post } from '../../Utilities';
import { getClientUserId } from '../../redux/reducers/clientUserId.reducer';
import { PageHeader } from '../Common/PageHeader/PageHeader';
import Homework from './Homework';
import Test from './Test';
import './styles.css';

export const OnlineAssignments = (props) => {
  const { clientUserId } = props;

  const [searchString, setSearchString] = useState('');
  const [key, setKey] = useState(0);

  const history = useHistory();

  useEffect(() => {
    searchAssignments('');
    console.log('Rendered');
  }, [key]);

  const searchAssignments = (search) => {
    setSearchString(search);
    // console.log(searchString);
  };

  const goToDashboard = () => {
    history.push('/');
  };

  return (
    <div className='container'>
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
          title='HomeWork'
          className='tab1 Profile__Tabs'
          // onClick={() => searchAssignments('')}
        >
          <Homework clientUserId={clientUserId} searchString={searchString} />
        </Tab>
        <Tab
          eventKey='1'
          title='Tests'
          className='tab2 Profile__Tabs'
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
