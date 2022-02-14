/** @jsxImportSource @emotion/react */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ProgressBar from 'react-bootstrap/ProgressBar';
import PhoneIcon from '@material-ui/icons/Phone';
import InfiniteScroll from 'react-infinite-scroll-component';
import avatarImage from '../../assets/images/user.svg';
import '../Dashboard/Dashboard.scss';
import './Fees.scss';
import UserDataCard from '../Admissions/UsersDataCard';
import { apiValidation, get, post } from '../../Utilities';
import AdmissionStyle from '../Admissions/Admissions.style';
import { PageHeader } from '../Common';

const AllStudentsForFee = (props) => {
  const { clientUserId, clientId, history, activeTab } = props;

  const [filters, setFilters] = useState([]);
  const [pageStudents, setPageStudents] = useState(1);
  const [searchPageStud, setSearchPageStud] = useState(1);
  const [searchString, setSearchString] = useState('');
  const [students, setStudents] = useState([]);
  const [searchedStudents, setSearchedStudents] = useState([]);

  // const infiniteScroll = () => {
  //   console.log(activeTab, 'Students');
  //   if (
  //     window.innerHeight + document.documentElement.scrollTop >=
  //       document.documentElement.offsetHeight- 200 ||
  //     window.innerHeight + document.body.scrollTop >= document.body.offsetHeight- 200
  //   ) {
  //     setSearchPageStud((prev) => prev + 1);
  //     setPageStudents((prev) => prev + 1);
  //   }
  // };

  // useEffect(() => {
  //   if (activeTab) {
  //     window.addEventListener('scroll', infiniteScroll);
  //   }

  //   return () => window.removeEventListener('scroll', infiniteScroll);
  // }, [activeTab]);

  const infiniteScroll = () => {
    setSearchPageStud((prev) => prev + 1);
    setPageStudents((prev) => prev + 1);
  };

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
      page: pageStudents,
    };

    get(payload, '/getUsersFeeDataOfClient2').then((res) => {
      const result = apiValidation(res);
      console.log(result);
      const final = [...students, ...result];
      setStudents(final);
    });
  }, []);

  useEffect(() => {
    let timer;
    if (searchString.length > 0 && activeTab) {
      timer = setTimeout(() => {
        const payload = {
          client_id: clientId,
          limit: 20,
          page: searchPageStud,
          keyword: searchString,
        };
        get(payload, '/searchUsersInFee2').then((res) => {
          const result = apiValidation(res);
          console.log(result, 'searchUsersInFees', searchPageStud);
          const resultant = [...searchedStudents, ...result];
          setSearchedStudents(resultant);
        });
      }, 500);
    } else if (searchString.length === 0 && activeTab) {
      const payload = {
        client_id: clientId,
        limit: 20,
        page: pageStudents,
      };
      get(payload, '/getUsersFeeDataOfClient2').then((res) => {
        const result = apiValidation(res);
        console.log(result, 'getUsersFeeData', pageStudents);
        const resultant = [...students, ...result];
        setStudents(resultant);
      });
    }
    return () => {
      clearTimeout(timer);
    };
  }, [clientId, searchString, pageStudents]);

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
          page: pageStudents,
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
    if (!search) window.scrollTo(0, 0);
    if (activeTab) {
      setSearchPageStud(1);
      setPageStudents(1);
      setStudents([]);
      setSearchedStudents([]);
    }
  };

  return (
    <div>
      <PageHeader title='Fees' search searchFilter={searchBatches} />
      <div className='mt-2'>
        <InfiniteScroll
          dataLength={(searchedStudents.length > 0 ? searchedStudents : students).length}
          next={infiniteScroll}
          hasMore
          height={document.documentElement.clientHeight - 130}
          loader={<h4 />}
        >
          {(students.length > 0 || searchedStudents.length > 0) &&
            (searchedStudents.length > 0 ? searchedStudents : students).map((student) => {
              return (
                <div key={student.user_id}>
                  <UserDataCard
                    elem={student}
                    FeeUser
                    history={history}
                    key={student.user_id}
                    notifyFeeUser={notifyFeeUser}
                    goToFeePlan={goToFeePlan}
                  />
                </div>
              );
            })}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default AllStudentsForFee;

AllStudentsForFee.propTypes = {
  clientId: PropTypes.number.isRequired,
  clientUserId: PropTypes.number.isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  activeTab: PropTypes.bool.isRequired,
};
