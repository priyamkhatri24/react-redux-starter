import { brandingActions } from '../../redux/actions/branding.action';
import { get } from '../../Utilities/Remote';

function getBranding(param) {
  return (dispatch) => {
    dispatch(brandingActions.clear());

    get(param, '/getClientbyDomain')
      .then((res) => {
        console.log(res);
        dispatch(brandingActions.success(res));
      })
      .catch((e) => dispatch(brandingActions.error(e)));
  };
}

export default getBranding;
