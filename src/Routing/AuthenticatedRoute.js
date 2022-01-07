/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-curly-newline */
/*eslint-disable*/

import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export const AuthenticatedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      JSON.parse(localStorage.getItem('state')).userProfile.token ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: '/preload', state: { from: props.location } }} />
      )
    }
  />
);
// ================================== For Trial Redux Authenticated Route =================================
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-curly-newline */
/*eslint-disable*/

// import React from 'react';
// import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
// import { Route, Redirect } from 'react-router-dom';
// import { getCurrentDashboardData } from '../redux/reducers/dashboard.reducer';

// const AuthenticatedRoute = ({ component: Component, ...rest }) => {
//   const { dashboardData } = rest;
//   console.log(dashboardData, 'IamfromauthenticatedRoute');
//   // dashboardData.client_status
//   return (
//     <Route
//       {...rest}
//       render={(props) =>
//         JSON.parse(localStorage.getItem('state')).userProfile.token ? (
//           <Component {...props} />
//         ) : (
//           <Redirect to={{ pathname: '/preload', state: { from: props.location } }} />
//         )
//       }
//     />
//   );
// };

// const mapStateToProps = (state) => {
//   return {
//     dashboardData: getCurrentDashboardData(state),
//   };
// };

// export default connect(mapStateToProps)(AuthenticatedRoute);

// AuthenticatedRoute.propTypes = {
//   dashboardData: PropTypes.instanceOf(Object).isRequired,
// };
