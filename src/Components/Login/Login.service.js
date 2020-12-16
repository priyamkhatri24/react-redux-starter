import { brandingActions } from '../../redux/actions/branding.action';
import { colorActions } from '../../redux/actions/color.actions';
import { clientUserIdActions } from '../../redux/actions/clientUserId.action';
import { get } from '../../Utilities/Remote';

export function getBranding(param) {
  return (dispatch) => {
    dispatch(brandingActions.clear());

    get(param, '/getClientbyDomain')
      .then((res) => {
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
