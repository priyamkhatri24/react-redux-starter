import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { dashboardActions } from '../../redux/actions/dashboard.action';

const Dashboard = (props) => {
  const { setLocationDataToStore, setDashboardDataToStore } = props;

  const [variable, setVariable] = useState('');

  useEffect(() => {
    fetch('https://api.country.is/')
      .then((res) => res.json())
      .then((dataa) => {
        fetch(`https://api.techniknews.net/ipgeo/${dataa.ip}`)
          .then((res2) => res2.json())
          .then((data1) => {
            setVariable(data1.country);
            setDashboardDataToStore(data1.country);
            setLocationDataToStore({
              country: data1.country,
              state: data1.regionName,
            });
          });
      });
  }, [setLocationDataToStore, setDashboardDataToStore]);

  return (
    <div className='Dashboard__mainContainerDiv'>
      <h1>Welcome to React-Redux Starter</h1>
      <p>{variable}</p>

      <footer style={{ paddingBottom: '1rem' }} className='py-2 Dashboard__footer mb-3'>
        <h6 className='Dashboard__footerText'>Powered By Prime</h6>
      </footer>
    </div>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  setDashboardDataToStore: (payload) => {
    dispatch(dashboardActions.setDashboardDataToStore(payload));
  },
  setLocationDataToStore: (payload) => {
    dispatch(dashboardActions.setLocationDataToStore(payload));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

Dashboard.propTypes = {
  setDashboardDataToStore: PropTypes.func.isRequired,
  setLocationDataToStore: PropTypes.func.isRequired,
};
