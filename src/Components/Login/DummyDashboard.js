import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { get } from '../../Utilities';
import { getCurrentBranding } from '../../redux/reducers/branding.reducer';
import YCIcon from '../../assets/images/ycIcon.png';
import '../Dashboard/Dashboard.scss';

const DummyDashboard = (props) => {
  const {
    clientId,
    currentbranding: { branding },
  } = props;

  useEffect(() => {
    get({ client_id: clientId }, '/getRecentDataLatest').then((res) => {
      console.log(res);
    });
  }, [clientId]);

  return (
    <>
      <div className='Dashboard__headerCard'>
        {/* <h4 className='Dashboard__headingText'>time</h4>
        <h4 className='Dashboard__headingText'>firstName</h4> */}

        <img src={branding.client_logo || YCIcon} className='img-fluid' alt='profile' />
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  currentbranding: getCurrentBranding(state),
});

export default connect(mapStateToProps)(DummyDashboard);

DummyDashboard.propTypes = {
  clientId: PropTypes.number.isRequired,
  currentbranding: PropTypes.instanceOf(Object).isRequired,
};
