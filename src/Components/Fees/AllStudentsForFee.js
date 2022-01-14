/** @jsxImportSource @emotion/react */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ProgressBar from 'react-bootstrap/ProgressBar';
import PhoneIcon from '@material-ui/icons/Phone';
import avatarImage from '../../assets/images/user.svg';
import '../Dashboard/Dashboard.scss';
import './Fees.scss';
import UserDataCard from '../Admissions/UsersDataCard';
import { apiValidation, get, post } from '../../Utilities';
import AdmissionStyle from '../Admissions/Admissions.style';
import { PageHeader } from '../Common';

const AllStudentsForFee = (props) => {
  const { clientUserId, clientId, history } = props;

  const [filters, setFilters] = useState([]);
  const [page, setPage] = useState(1);
  const [searchString, setSearchString] = useState('');

  // const [currentClass, setCurrentClass] = useState({});
  // const [currentSubject, setCurrentSubject] = useState({});
  const [students, setStudents] = useState([]);

  const infiniteScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight
    ) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', infiniteScroll);

    return () => window.removeEventListener('scroll', infiniteScroll);
  }, []);

  useEffect(() => {
    get({ client_id: clientId }, '/getFilters').then((res) => {
      console.log(res, 'filters array');
      const result = apiValidation(res);
      setFilters(result);
    });
  }, [clientId]);

  useEffect(() => {
    const payload = {
      client_id: clientId,
      limit: 20,
      page,
    };

    get(payload, '/getUsersFeeDataOfClient2').then((res) => {
      const result = apiValidation(res);
      console.log(result);
      const final = [...students, ...result];
      // console.log(result, final, 'getuserfeedata');
      setStudents(final);
    });
  }, [clientId, page]);

  useEffect(() => {
    let timer;
    if (searchString) {
      timer = setTimeout(() => {
        const payload = {
          client_id: clientId,
          limit: 20,
          page,
          keyword: searchString,
        };
        get(payload, '/searchUsersInFee2').then((res) => {
          const result = apiValidation(res);
          console.log(result);
          setStudents(result);
        });
      }, 500);
    } else {
      const payload = {
        client_id: clientId,
        limit: 20,
        page,
      };
      get(payload, '/getUsersFeeDataOfClient2').then((res) => {
        const result = apiValidation(res);
        console.log(result);
        setStudents(result);
      });
    }
    return () => {
      clearTimeout(timer);
    };
  }, [clientId, searchString]);

  const notifyFeeUser = (userId, receiverId) => {
    const payload = {
      user_id: userId,
      title: 'Fee',
      topic:
        process.env.NODE_ENV === 'development'
          ? `developmentuser${receiverId}`
          : `productionuser${receiverId}`,
      sender_id: clientUserId,
      client_id: clientId,
      reciever_id: receiverId,
    };

    post(payload, '/notifyStudentForFee').then((res) => {
      if (res.success) {
        const payloadd = {
          client_id: clientId,
          limit: 20,
          page,
        };

        get(payloadd, '/getUsersFeeDataOfClient2').then((respp) => {
          const result = apiValidation(respp);
          console.log(result);
          // const final = [...students, ...result];
          // console.log(result, final, 'getuserfeedata');
          setStudents(result);
        });
      }
    });
  };

  const goToFeePlan = (elem) => {
    history.push({
      pathname: '/fees/students',
      state: { studentData: elem },
    });
  };

  const searchBatches = (search) => {
    setSearchString(search);
  };

  return (
    <div>
      <PageHeader title='Fees' search searchFilter={searchBatches} />
      <div className='mt-4'>
        {students.map((student) => {
          return (
            <>
              {/* <Card
                css={AdmissionStyle.card}
                key={student.user_id + student.first_name}
                className=''
              >
                <Row className=' m-0 px-2 my-auto'>
                  <Col xs={2} sm={1} style={{ paddingTop: '15px' }}>
                    <img
                      src={student.profile_image || avatarImage}
                      alt='avatar'
                      height='38'
                      width='38'
                      css={AdmissionStyle.avatar}
                    />
                  </Col>
                  <Col xs={7} sm={9} style={{ paddingTop: '10px' }}>
                    <p css={AdmissionStyle.avatarHeading} className='mb-0 mt-2 ml-2'>
                      {`${student.first_name} ${student.last_name}`}
                    </p>
                    <p className='mb-0' css={AdmissionStyle.avatarStatus}>
                      <PhoneIcon css={AdmissionStyle.onlineIcon} />
                      +91-{student.contact}
                    </p>
                  </Col>
                  <Col className='statusContainer' xs={3} sm={2}>
                    <h4
                      className={`${
                        student.fee_status === 'due'
                          ? 'dueText'
                          : student.fee_status === 'paid'
                          ? 'paidText'
                          : 'noPlanText'
                      }`}
                      style={student.is_fee !== 'true' ? { color: 'gray' } : {}}
                    >
                      {student.is_fee === 'true' ? student.fee_status : 'No Plan'}
                    </h4>
                    {student.fee_status === 'due' ? (
                      <button type='button' className='notifyButton'>
                        Notify
                      </button>
                    ) : null}
                  </Col>
                </Row>
              </Card> */}
              <UserDataCard
                elem={student}
                FeeUser
                history={history}
                key={student.user_id}
                notifyFeeUser={notifyFeeUser}
                goToFeePlan={goToFeePlan}
              />
            </>
          );
        })}
      </div>
    </div>
  );
};

export default AllStudentsForFee;

AllStudentsForFee.propTypes = {
  clientId: PropTypes.number.isRequired,
  clientUserId: PropTypes.number.isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  // searchString: PropTypes.string,
};

// AllStudentsForFee.defaultProps = {
//   searchString: '',
// };
