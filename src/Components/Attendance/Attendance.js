import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import userAvatar from '../../assets/images/user.svg';
import { PageHeader } from '../Common';
import '../Profile/Profile.scss';
import { getClientUserId } from '../../redux/reducers/clientUserId.reducer';
import { history } from '../../Routing';
import { apiValidation, get } from '../../Utilities';
import BottomNavigation from '../Common/BottomNavigation/BottomNavigation';
import { attendanceActions } from '../../redux/actions/attendance.action';
import './Attendance.scss';

const Attendance = (props) => {
  const { clientUserId, setAttendanceBatchToStore } = props;
  const [searchString, setSearchString] = useState('');
  const [batches, setBatches] = useState([]);
  // const [page, setPage] = useState(1);

  useEffect(() => {
    get({ client_user_id: clientUserId }, '/getBatchesOfTeacher').then((res) => {
      const result = apiValidation(res);
      console.log(result);
      const filteredBatches = result.filter(
        (e) => e.batch_name.toLowerCase().indexOf(searchString.toLowerCase()) > -1,
      );
      setBatches(filteredBatches);
    });
  }, [clientUserId, searchString]);

  // const infiniteScroll = () => {
  //   if (
  //     window.innerHeight + document.documentElement.scrollTop >=
  //     document.documentElement.offsetHeight
  //   ) {
  //     setPage((prev) => prev + 1);
  //   }
  // };

  // useEffect(() => {
  //   window.addEventListener('scroll', infiniteScroll);

  //   return () => window.removeEventListener('scroll', infiniteScroll);
  // }, []);

  // pagination code...

  // useEffect(() => {
  //   let timer;
  //   if (searchString.length === 0) {
  //     const payload = {
  //       client_user_id: clientUserId,
  //       page,
  //     };
  //     get(payload, '/getBatchesOfTeacher2').then((res) => {
  //       const result = apiValidation(res);
  //       console.log(result);
  //       const filteredBatches = [...batches, ...result];
  //       setBatches(filteredBatches);
  //     });
  //   } else {
  //     timer = setTimeout(() => {
  //       const payload = {
  //         client_user_id: clientUserId,
  //         page,
  //         keyword: searchString,
  //       };
  //       get(payload, '/getAllLiveStreamsForAttendance2').then((res) => {
  //         const result = apiValidation(res);
  //         console.log(result);
  //       }, 500);
  //     });
  //   }
  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, [clientUserId, page, searchString]);

  const searchUsers = (search) => {
    setSearchString(search);
  };

  const goToBatch = (elem) => {
    setAttendanceBatchToStore(elem);
    history.push('/attendance/batch');
  };

  return (
    <>
      <PageHeader title='Attendance' search searchFilter={searchUsers} />
      <div style={{ marginTop: '5rem', marginBottom: '0.5rem' }}>
        {batches.length > 0 ? (
          batches.map((elem) => {
            return (
              <Card
                className='Attendance__Card mb-2'
                style={{ boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.16)', borderRadius: '10px' }}
                key={elem.client_batch_id}
                onClick={() => goToBatch(elem)}
              >
                <Row className='p-2 align-items-center'>
                  <Col xs={3} className='text-center'>
                    <img
                      src={userAvatar}
                      className='img-fluid'
                      alt='profile'
                      width='40'
                      height='40'
                    />
                  </Col>
                  <Col xs={6}>
                    <p className='Attendance__batchName m-0'>{elem.batch_name}</p>
                  </Col>
                  <Col xs={3} className='text-center'>
                    <p className='m-0 Attendance__batchCount'>{elem.count}</p>
                    <p className='m-0 Attendance__batchStudents'>Students</p>
                  </Col>
                </Row>
              </Card>
            );
          })
        ) : (
          <p>There Are No batches Added Currently</p>
        )}
      </div>

      <BottomNavigation history={history} activeNav='attendance' />
    </>
  );
};

const mapStateToProps = (state) => ({
  clientUserId: getClientUserId(state),
});

const mapDispatchToProps = (dispatch) => {
  return {
    setAttendanceBatchToStore: (payload) => {
      dispatch(attendanceActions.setAttendanceBatchToStore(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Attendance);

Attendance.propTypes = {
  clientUserId: PropTypes.number.isRequired,
  setAttendanceBatchToStore: PropTypes.func.isRequired,
  // history: PropTypes.instanceOf(Object).isRequired,
};
