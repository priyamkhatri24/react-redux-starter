import { brandingActions } from '../../redux/actions/branding.action';
import { get } from '../../Utilities/Remote';

function getBranding(param) {
  return (dispatch) => {
    console.log('hello');
    dispatch(brandingActions.clear());

    get(param, '/getClientbyDomain')
      .then((res) => {
        dispatch(brandingActions.success(res));
      })
      .catch((e) => dispatch(brandingActions.error(e)));
  };
}

export default getBranding;
