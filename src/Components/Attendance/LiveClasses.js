import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import { get, apiValidation, post } from '../../Utilities';
import {
  getClientId,
  getRoleArray,
  getClientUserId,
} from '../../redux/reducers/clientUserId.reducer';

import './LiveClasses.scss';

const LiveClasses = (props) => {
  const { clientUserId, roleArray, clientId, searchString } = props;
  const [classes, setClasses] = useState([]);
  const [page, setPage] = useState(1);

  const history = useHistory();

  const infiniteScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight ||
      window.innerHeight + document.body.scrollTop >= document.body.offsetHeight
    ) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', infiniteScroll);
    return () => window.removeEventListener('scroll', infiniteScroll);
  }, []);

  useEffect(() => {
    // let timer;
    // if (searchString.length === 0) {
    const payload = {
      client_user_id: clientUserId,
      client_id: clientId,
      is_admin: roleArray.includes(4),
      page,
    };

    get(payload, '/getAllLiveStreamsForAttendance2').then((res) => {
      const result = apiValidation(res);
      console.log(result);
      const resultant = [...classes, ...result];
      setClasses(resultant);
    });
    // } else {
    //   timer = setTimeout(() => {
    //     const payload = {
    //       client_user_id: clientUserId,
    //       client_id: clientId,
    //       is_admin: roleArray.includes(4),
    //       page,
    //     };

    //     get(payload, '/getAllLiveStreamsForAttendance2').then((res) => {
    //       const result = apiValidation(res);
    //       console.log(result);
    //       const resultant = [...classes, ...result];
    //       setClasses(resultant);
    //     });
    //   });
    // }
    // return () => {
    //   clearTimeout(timer);
    // };
  }, [clientUserId, page, searchString]);

  // useEffect(() => {
  //   const payload = {
  //     client_user_id: clientUserId,
  //     client_id: clientId,
  //     is_admin: roleArray.includes(4),
  //     page,
  //   };

  //   get(payload, '/getAllLiveStreamsForAttendance2').then((res) => {
  //     const result = apiValidation(res);
  //     console.log(result);
  //     const resultant = [...classes, ...result];
  //     setClasses(resultant);
  //   });
  // }, [page, searchString]);

  const handleClick = (id) => {
    history.push({
      pathname: `/analysis`,
      state: id,
    });
  };

  return (
    <div className='cardBody mx-auto'>
      {classes.length > 0 &&
        classes.map((i) => {
          return (
            <Card
              className='cardContainer'
              style={{ boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.16)', marginTop: '20px' }}
              onClick={() => {
                handleClick(i);
              }}
            >
              <div className='d-flex flex-row p-3 justify-content-between'>
                <Card.Body className='body1'>
                  <Card.Title className='cardTitle'>
                    Streamed on {moment(i.created_at * 1000).format('h:mm MMM Do, YYYY')} (by-
                    {i.first_name})
                  </Card.Title>
                  <Card.Subtitle className='type'>
                    Type: <span className='alpha'>{i.stream_type}</span>
                  </Card.Subtitle>
                  <Card.Subtitle className='streamedIn'>
                    Streamed in:{' '}
                    {i.batch_array.slice(0, 15).map((e) => (
                      <span>{e}, </span> // eslint-disable-line
                    ))}
                    {i.batch_array.length > 15 ? <span>...</span> : null}
                  </Card.Subtitle>
                </Card.Body>
              </div>
            </Card>
          );
        })}
    </div>
  );
};
const mapStateToProps = (state) => ({
  clientUserId: getClientUserId(state),
  roleArray: getRoleArray(state),
  clientId: getClientId(state),
});
export default connect(mapStateToProps)(LiveClasses);

LiveClasses.propTypes = {
  clientUserId: PropTypes.number.isRequired,
  roleArray: PropTypes.instanceOf(Array).isRequired,
  clientId: PropTypes.number.isRequired,
  searchString: PropTypes.string.isRequired,
};
