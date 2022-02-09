import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import InfiniteScroll from 'react-infinite-scroll-component';
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

  // const infiniteScroll = () => {
  //   if (
  //     window.innerHeight + document.documentElement.scrollTop >=
  //       document.documentElement.offsetHeight- 200 ||
  //     window.innerHeight + document.body.scrollTop >= document.body.offsetHeight- 200
  //   ) {
  //     setPage((prev) => prev + 1);
  //   }
  // };

  // useEffect(() => {
  //   window.addEventListener('scroll', infiniteScroll);
  //   return () => window.removeEventListener('scroll', infiniteScroll);
  // }, []);

  const infiniteScroll = () => {
    setPage((prev) => prev + 1);
  };

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
    <div className='AttendanceLiveClasses__cardBody mx-auto'>
      <InfiniteScroll
        dataLength={classes.length}
        next={infiniteScroll}
        hasMore
        height={document.documentElement.clientHeight - 130}
        loader={<h4 />}
      >
        {classes.length > 0 &&
          classes.map((i) => {
            return (
              <Card
                className='AttendanceLiveClasses__cardContainer'
                style={{ boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.16)' }}
                onClick={() => {
                  handleClick(i);
                }}
              >
                <div className='d-flex flex-row p-3 justify-content-between'>
                  <Card.Body className='AttendanceLiveClasses__body1'>
                    <Card.Title className='AttendanceLiveClasses__cardTitle'>
                      Streamed on {moment(i.created_at * 1000).format('h:mm MMM Do, YYYY')} (by-
                      {i.first_name})
                      {/* Streamed on {createdAt.split(' ').slice(1,5).join(' ')} (by-
                    {i.first_name}) */}
                    </Card.Title>
                    <Card.Subtitle className='AttendanceLiveClasses__type'>
                      Type: <span className='AttendanceLiveClasses__alpha'>{i.stream_type}</span>
                    </Card.Subtitle>
                    <Card.Subtitle className='AttendanceLiveClasses__streamedIn'>
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
      </InfiniteScroll>
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
