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
  // console.log(clientUserId);

  const [key, setKey] = useState('0');
  const [homework, setHomework] = useState([]);
  const [liveTests, setLiveTests] = useState([]);
  const [demoTests, setDemoTests] = useState([]);
  const [searchString, setSearchString] = useState('');

  const history = useHistory();

  useEffect(() => {
    get({ client_user_id: clientUserId }, '/getHomeworkOfStudent').then((res) => {
      const result = apiValidation(res);
      setHomework(result);
    });

    get({ client_user_id: clientUserId }, '/getAllTestOfStudent').then((res) => {
      const result = apiValidation(res);
      const [live, demo] = result.reduce(
        ([p, f], e) => (e.test_type === 'live test' ? [[...p, e], f] : [p, [...f, e]]),
        [[], []],
      );
      setLiveTests(live);
      setDemoTests(demo);

      // console.log(live);
    });
    // console.log(homework);
    // console.log(liveTests);
    // console.log(demoTests);
  }, []);

  const searchCRM = (search) => {
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
        searchFilter={searchCRM}
        // triggerFilters={() => setOpenFilterModal(true)}
        customBack
        handleBack={goToDashboard}
      />
      <Tabs
        id='controlled-tab-example'
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className='mb-3 tab tabs Profile__Tabs'
      >
        <Tab eventKey='0' title='HomeWork' className='tab Profile__Tabs'>
          <Homework clientUserId={clientUserId} homework={homework} searchString={searchString} />
        </Tab>
        <Tab eventKey='1' title='Tests' className='tab Profile__Tabs'>
          <Test
            clientUserId={clientUserId}
            liveTests={liveTests}
            demoTests={demoTests}
            searchString={searchString}
          />
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
