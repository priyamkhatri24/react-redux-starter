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

const Homework = (props) => {
  const { clientUserId, searchString } = props;
  const [homeworkToDisplay, sethomeworkToDisplay] = useState([]);

  useEffect(() => {
    let timer;
    // console.log(searchString);
    if (searchString) {
      timer = setTimeout(() => {
        get({ client_user_id: clientUserId }, '/getHomeworkOfStudent').then((res) => {
          const result = apiValidation(res);
          const data = result.filter((elem) => {
            return elem.test_name.toLowerCase().includes(searchString);
          });
          sethomeworkToDisplay(data);
          // console.log(homeworkToDisplay);
        });
      }, 500);
    } else {
      get({ client_user_id: clientUserId }, '/getHomeworkOfStudent').then((res) => {
        const result = apiValidation(res);
        sethomeworkToDisplay(result);
        // console.log(homeworkToDisplay);
      });
    }

    return () => {
      clearTimeout(timer);
    };
  }, [searchString, clientUserId]);

  if (!homeworkToDisplay.length) {
    return (
      <div className='noMatch'>
        <bold>No match found :(</bold>
      </div>
    );
  }

  return (
    <section className='Tests__scrollableCard divContainer'>
      {homeworkToDisplay.map((elem) => {
        return (
          <div
            key={elem.test_id}
            className='ml-2 divContainer'
            // onClick={() => startHomeworkTest(elem)}
            // onKeyDown={() => startHomeworkTest(elem)}
            tabIndex='-1'
            role='button'
          >
            <Row>
              <Col xs={9} className='pr-0'>
                <p className='Tests__scrollableCardHeading pt-2 pl-3 mb-0'>Homework</p>
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
                      'invert(35%) sepia(80%) saturate(6195%) hue-rotate(211deg) brightness(102%) contrast(106%)',
                  }}
                />
              </Col>
            </Row>
          </div>
        );
      })}
    </section>
  );
};
export default Homework;
Homework.propTypes = {
  clientUserId: PropTypes.number.isRequired,
  searchString: PropTypes.string.isRequired,
};
// <div>
//   {homework.map((i) => {
//     return <div id={i.test_id}>{i.test_name}</div>;
//   })}
// </div>
