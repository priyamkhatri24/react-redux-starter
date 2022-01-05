import { brandingActions } from '../../redux/actions/branding.action';
import { colorActions } from '../../redux/actions/color.actions';
import { clientUserIdActions } from '../../redux/actions/clientUserId.action';
import { get } from '../../Utilities/Remote';
import { history } from '../../Routing';
import { userProfileActions } from '../../redux/actions/userProfile.action';

export function getBranding(param) {
  return (dispatch) => {
    dispatch(brandingActions.clear());

    get(param, '/getClientbyDomain')
      .then((res) => {
        // console.log(res, 'getclientbydomain======');
        if (res.result === 'invaid_domain') {
          history.push('/invalidurl');
          return;
        }
        dispatch(clientUserIdActions.setClientIdToStore(res.result[0].client_id));
        dispatch(brandingActions.success(res.result[0]));
      })
      .catch((e) => dispatch(brandingActions.error(e)));
  };
}

export function getColor(param) {
  return (dispatch) => {
    dispatch(colorActions.clear());
    dispatch(colorActions.success(param));
  };
}

export function getContact(param, countryCode) {
  return (dispatch) => {
    dispatch(userProfileActions.setContactToStore(param));
    dispatch(userProfileActions.setCountryCodeToStore(countryCode));
  };
}
