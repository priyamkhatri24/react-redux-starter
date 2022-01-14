import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import format from 'date-fns/format';
import fromUnixTime from 'date-fns/fromUnixTime';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import { apiValidation, get } from '../../Utilities';
import './Fees.scss';
import { PageHeader } from '../Common';

const FeesTimeline = (props) => {
  const { clientId } = props;
  const [notifications, setNotifications] = useState([]);
  
  const [page, setPage] = useState(1);
  const [searchPage, setSearchPage] = useState(1);
  const [searchString, setSearchString] = useState('');


  const infiniteScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight
    ) {
      setPage((prev) => prev + 1);
      setSearchPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', infiniteScroll);

    return () => window.removeEventListener('scroll', infiniteScroll);
  }, []);

  useEffect(() => {
    get({ client_id: clientId, page }, '/getFeeNotificationsForCoaching2').then((res) => {
      console.log(res);
      const result = apiValidation(res);
      const searchedArray = [...notifications, ...result];
      setNotifications(searchedArray);
    });
  }, [clientId, page]);

  useEffect(() => {
    let timer;
    if (searchString) {
      timer = setTimeout(() => {
        const payload = {
          client_id: clientId,
          page: searchPage,
          keyword: searchString,
        };
        get(payload, '/searchInFeeNotication').then((res) => {
          const result = apiValidation(res);
          console.log(result);
          setNotifications(result);
        });
      }, 500);
    } else {
      get({ client_id: clientId, page }, '/getFeeNotificationsForCoaching2').then((res) => {
        console.log(res);
        const result = apiValidation(res);
        setNotifications(result);
      });
    }
    return () => {
      clearTimeout(timer);
    };
  }, [clientId, searchPage, searchString,page]);

  // useEffect(() => {
  //   if (!searchString) {
  //     setSearchPage(1);
  //   }
  // }, [searchString]);

  const searchBatches = (search) => {
    setSearchString(search);
  };
  
  return (
    <>
      <PageHeader title='Fees' search searchFilter={searchBatches} />
      <VerticalTimeline>
        {notifications.length > 0 &&
          notifications.map((elem) => {
            return (
              <VerticalTimelineElement
                iconStyle={{
                  color: 'var(--primary-blue)',
                  height: '15px',
                  width: '15px',
                  marginTop: '20px',
                  marginLeft: '12px',
                  background: '#fff',
                }}
                icon={<RadioButtonUncheckedIcon />}
                className='Fees__timeline text-left'
                key={elem.notification_id}
                contentStyle={{ padding: 0 }}
                contentArrowStyle={{ color: '#000', height: '50px' }}
              >
                <p
                  style={{
                    textAlign: 'left',
                    fontSize: '10px',
                    lineHeight: '13px',
                    color: 'rgba(0, 0, 0, 0.54)',
                    fontFamily: 'Montserrat-SemiBold',
                  }}
                >
                  {format(
                    fromUnixTime(parseInt(elem.time_of_notification, 10)),
                    'HH:mm MMM dd,yyyy',
                  )}
                </p>
                <h6
                  style={{
                    textAlign: 'left',
                    fontSize: '14px',
                    lineHeight: '20px',
                    color: 'rgba(0, 0, 0, 0.87)',
                    fontFamily: 'Montserrat-SemiBold',
                  }}
                >
                  {elem.message}
                </h6>
                <h6
                  style={{
                    textAlign: 'left',
                    fontSize: '20px',
                    lineHeight: '24px',
                    color: 'rgba(0, 0, 0, 1)',
                    fontFamily: 'Montserrat-Regular',
                  }}
                >
                  &#8377; {elem.amount}
                </h6>
                <p
                  style={{
                    textAlign: 'left',
                    fontSize: '10px',
                    lineHeight: '13px',
                    color: 'rgba(0, 0, 0, 0.54)',
                    fontFamily: 'Montserrat-SemiBold',
                  }}
                >
                  {elem.method}
                </p>
              </VerticalTimelineElement>
            );
          })}
      </VerticalTimeline>
    </>
  );
};

export default FeesTimeline;

FeesTimeline.propTypes = {
  clientId: PropTypes.number.isRequired,
  // searchString: PropTypes.string,
};

// FeesTimeline.defaultProps = {
//   searchString: '',
// };
