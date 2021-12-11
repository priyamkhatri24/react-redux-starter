import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import fromUnixTime from 'date-fns/fromUnixTime';
import compareAsc from 'date-fns/compareAsc';
import format from 'date-fns/format';
import Swal from 'sweetalert2';
import { connect } from 'react-redux';
import dashboardAssignmentImage from '../../assets/images/Dashboard/dashboardAssignment.svg';

import { get, apiValidation, post } from '../../Utilities';
import './Tests.scss';

const Test = (props) => {
  const { clientUserId, searchString } = props;
  const [liveTests, setLiveTests] = useState([]);
  const [demoTests, setDemoTests] = useState([]);

  useEffect(() => {
    let timer;
    if (searchString) {
      timer = setTimeout(() => {
        get({ client_user_id: clientUserId }, '/getAllTestOfStudent').then((res) => {
          const result = apiValidation(res);
          const [live, demo] = result.reduce(
            ([p, f], e) => (e.test_type === 'live test' ? [[...p, e], f] : [p, [...f, e]]),
            [[], []],
          );
          const liveData = live.filter((elem) => {
            return elem.test_name.toLowerCase().includes(searchString);
          });
          const demoData = demo.filter((elem) => {
            return elem.test_name.toLowerCase().includes(searchString);
          });
          setLiveTests(liveData);
          setDemoTests(demoData);
        });
      }, 500);
    } else {
      get({ client_user_id: clientUserId }, '/getAllTestOfStudent').then((res) => {
        const result = apiValidation(res);
        const [live, demo] = result.reduce(
          ([p, f], e) => (e.test_type === 'live test' ? [[...p, e], f] : [p, [...f, e]]),
          [[], []],
        );
        setLiveTests(live);
        setDemoTests(demo);
      });
    }
    return () => {
      clearTimeout(timer);
    };
  }, [clientUserId, searchString]);

  if (!liveTests.length && !demoTests.length) {
    console.log(liveTests.length);
    return (
      <div>
        <bold>no match found</bold>
      </div>
    );
  }

  return (
    <div>
      {liveTests.length > 0 && (
        <section className='Tests__scrollableCard divContainer'>
          {liveTests.map((elem) => {
            return (
              <div
                key={elem.test_id}
                className='ml-2'
                // onClick={() => startLiveTest(elem)}
                // onKeyDown={() => startLiveTest(elem)}
                tabIndex='-1'
                role='button'
              >
                <Row>
                  <Col xs={9} className='pr-0'>
                    <p className='Tests__scrollableCardHeading pt-2 pl-3 mb-0'>
                      <span style={{ color: 'rgba(255, 0, 0, 0.87)' }}>Live</span>{' '}
                      <span style={{ color: 'rgba(0, 0, 0, 0.87)' }}>Test</span>
                    </p>
                    <p className='Tests__scrollableCardText pl-3 mt-1'>{elem.test_name}</p>
                    {/* <LiveTestCounter id={elem.test_id} isAllowed={isAllowed} /> */}
                  </Col>
                  <Col xs={3} className='pt-3 px-0 livetestImg'>
                    <img
                      src={dashboardAssignmentImage}
                      alt='assignment'
                      height='63px'
                      width='57px'
                      style={{
                        filter:
                          'invert(16%) sepia(88%) saturate(7487%) hue-rotate(2deg) brightness(95%) contrast(117%)',
                      }}
                    />
                  </Col>
                </Row>
              </div>
            );
          })}
        </section>
      )}
      {demoTests.length > 0 && (
        <section className='Tests__scrollableCard divContainer'>
          {demoTests.map((elem) => {
            return (
              <div
                key={elem.test_id}
                className='ml-2'
                // onClick={() => startDemoTest(elem)}
                // onKeyDown={() => startDemoTest(elem)}
                tabIndex='-1'
                role='button'
              >
                <Row>
                  <Col xs={9} className='pr-0'>
                    <p className='Tests__scrollableCardHeading pt-2 pl-3 mb-0'>
                      <span style={{ color: 'rgba(207, 236, 0, 0.87)' }}>Demo</span>{' '}
                      <span style={{ color: 'rgba(0, 0, 0, 0.87)' }}>Test</span>
                    </p>
                    <p className='Tests__scrollableCardText pl-3 mt-1 mb-0'>{elem.test_name}</p>
                    <p className='Tests__scrollableCardText pl-3 mt-1'>
                      Due:{' '}
                      <span className='Tests__Counter'>
                        {format(fromUnixTime(elem.due_date), 'MMM dd, yyyy')}
                      </span>
                    </p>
                  </Col>
                  <Col xs={3} className='pt-3 px-0'>
                    <img
                      src={dashboardAssignmentImage}
                      alt='assignment'
                      height='63px'
                      width='57px'
                      style={{
                        filter:
                          'invert(79%) sepia(86%) saturate(518%) hue-rotate(10deg) brightness(95%) contrast(102%)',
                      }}
                    />
                  </Col>
                </Row>
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
};
export default Test;
Test.propTypes = {
  clientUserId: PropTypes.number.isRequired,
  searchString: PropTypes.string.isRequired,
};
