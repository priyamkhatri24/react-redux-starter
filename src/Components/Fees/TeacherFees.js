import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { connect } from 'react-redux';
import { getClientId } from '../../redux/reducers/clientUserId.reducer';
import { apiValidation, get } from '../../Utilities';
import FeeCarousel from './FeeCarousel';
import FeesTimeline from './FeesTimeline';
import { PageHeader } from '../Common';

const TeacherFees = (props) => {
  const { clientId } = props;
  const [carouselDetails, setCarouselDetails] = useState({});

  useEffect(() => {
    get({ client_id: clientId }, '/getAnnualFeeDetailsForCoaching').then((res) => {
      const result = apiValidation(res);
      console.log(result);
      setCarouselDetails(result);
    });
  }, [clientId]);

  return (
    <>
      <PageHeader title='Fees' />
      <div style={{ marginTop: '5rem' }}>
        <FeeCarousel carouselObject={carouselDetails} />
        <Tabs
          defaultActiveKey='Notifications'
          className='Profile__Tabs mt-4'
          justify
          style={{ fontSize: '12px' }}
        >
          <Tab eventKey='Notifications' title='Notifications'>
            <FeesTimeline />
          </Tab>
          <Tab eventKey='Batches' title='Batches'>
            Batches ayenge yahan
          </Tab>
          <Tab eventKey='Summary' title='Summary'>
            Coming Soon
          </Tab>
        </Tabs>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  clientId: getClientId(state),
});

export default connect(mapStateToProps)(TeacherFees);

TeacherFees.propTypes = {
  clientId: PropTypes.number.isRequired,
};
