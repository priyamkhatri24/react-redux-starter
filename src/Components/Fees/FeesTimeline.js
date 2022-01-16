import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import format from 'date-fns/format';
import fromUnixTime from 'date-fns/fromUnixTime';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import { apiValidation, get } from '../../Utilities';
import { PageHeader } from '../Common';
import './Fees.scss';

const FeesTimeline = (props) => {
  const { clientId, activeTab } = props;
  const [notifications, setNotifications] = useState([]);
  const [searchedNotifications, setSearchedNotifications] = useState([]);
  const [pageNotif, setPageNotif] = useState(1);
  const [searchPageNotif, setSearchPageNotif] = useState(1);
  const [searchString, setSearchString] = useState('');

  const infiniteScroll = () => {
    console.log(activeTab, 'notif');
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight ||
      window.innerHeight + document.body.scrollTop >= document.body.offsetHeight
    ) {
      setSearchPageNotif((prev) => {
        console.log(prev, 'searchPage');
        return prev + 1;
      });
      setPageNotif((prev) => {
        console.log(prev, 'page');
        return prev + 1;
      });
    }
  };

  useEffect(() => {
    if (activeTab) {
      window.addEventListener('scroll', infiniteScroll);
    }

    return () => window.removeEventListener('scroll', infiniteScroll);
  }, [activeTab]);

  // useEffect(() => {
  //   get({ client_id: clientId, page }, '/getFeeNotificationsForCoaching2').then((res) => {
  //     console.log(res);
  //     const result = apiValidation(res);
  //     const searchedArray = [...notifications, ...result];
  //     setSearchedNotifications(searchedArray);
  //   });
  // }, [clientId, page]);

  useEffect(() => {
    let timer;
    if (searchString.length > 0 && activeTab) {
      timer = setTimeout(() => {
        const payload = {
          client_id: clientId,
          page: searchPageNotif,
          keyword: searchString,
        };
        get(payload, '/searchInFeeNotication').then((res) => {
          const result = apiValidation(res);
          console.log(result, 'searchInNotifs', searchPageNotif);
          const resultant = [...searchedNotifications, ...result];
          setSearchedNotifications(resultant);
        });
      }, 500);
    }
    if (searchString.length === 0 && activeTab) {
      get({ client_id: clientId, page: pageNotif }, '/getFeeNotificationsForCoaching2').then(
        (res) => {
          const result = apiValidation(res);
          console.log(result, 'getFeeNotifss', pageNotif);
          const resultant = [...notifications, ...result];
          setNotifications(resultant);
        },
      );
    }
    return () => {
      clearTimeout(timer);
    };
  }, [searchString, pageNotif]);

  const searchBatches = (search) => {
    setSearchString(search);
    if (!search) window.scrollTo(0, 0);
    if (activeTab) {
      setNotifications([]);
      setSearchedNotifications([]);
      setPageNotif(1);
      setSearchPageNotif(1);
    }
  };

  return (
    <>
      <PageHeader title='Fees' search searchFilter={searchBatches} />
      <VerticalTimeline>
        {(notifications.length > 0 || searchedNotifications.length > 0) &&
          (searchedNotifications.length > 0 ? searchedNotifications : notifications).map((elem) => {
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
  activeTab: PropTypes.bool.isRequired,
};
