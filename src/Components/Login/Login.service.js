import { brandingActions } from '../../redux/actions/branding.action';
import { colorActions } from '../../redux/actions/color.actions';
import { get } from '../../Utilities/Remote';

// function changeFaviconAndDocumentTitle(favicon, documentTitle = 'Ingenium Education') {
//   const link = document.createElement('link');
//   const oldLink = document.getElementById('dynamic-favicon');
//   link.id = 'dynamic-favicon';
//   link.rel = 'shortcut icon';
//   link.href = favicon;
//   document.title = documentTitle;
//   if (oldLink) {
//     document.head.removeChild(oldLink);
//   }
//   document.head.appendChild(link);
// }

export function getBranding(param) {
  return (dispatch) => {
    dispatch(brandingActions.clear());

    get(param, '/getClientbyDomain')
      .then((res) => {
        // changeFaviconAndDocumentTitle(res.result[0].client_icon, res.result[0].client_title);
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
