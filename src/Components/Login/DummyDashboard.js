import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { get } from '../../Utilities';

const DummyDashboard = (props) => {
  const { clientId } = props;

  useEffect(() => {
    get({ client_id: clientId }, '/getRecentDataLatest').then((res) => {
      console.log(res);
    });
  }, [clientId]);

  return <div>dummy</div>;
};

export default DummyDashboard;

DummyDashboard.propTypes = {
  clientId: PropTypes.number.isRequired,
};
