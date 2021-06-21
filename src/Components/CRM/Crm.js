import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getClientId } from '../../redux/reducers/clientUserId.reducer';

const CRM = (props) => {
  const { clientId } = props;
  return <div>All the best Kanishk!</div>;
};

const mapStateToProps = (state) => ({
  clientId: getClientId(state),
});

export default connect(mapStateToProps)(CRM);

CRM.propTypes = {
  clientId: PropTypes.number.isRequired,
};
