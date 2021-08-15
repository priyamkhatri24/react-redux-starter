import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

const apiKeys = {
  apiKey: process.env.REACT_APP_ZOOM_SDK_KEY,
  apiSecret: process.env.REACT_APP_ZOOM_SDK_SECRET,
};

const addCss = (fileName) => {
  const { head } = document;
  const link = document.createElement('link');

  link.type = 'text/css';
  link.rel = 'stylesheet';
  link.href = fileName;

  head.appendChild(link);
};

const ZoomMeeting = (props) => {
  const { meetingNo, meetingPass, signature } = props;
  const [startZoom, setStartZoom] = useState(true);

  const config = {
    apiKey: apiKeys.apiKey,
    meetingNumber: meetingNo,
    userName: 'Example',
    userEmail: 'example@example.com', // must be the attendee email address
    passWord: meetingPass,
    role: 1,
  };

  function joinMeeting(zoomsignature, meetConfig) {
    window.ZoomMtg.init({
      leaveUrl: 'https://zoom.us/',
      isSupportAV: true,
      success(success) {
        console.log('Init Success ', success);
        window.ZoomMtg.join({
          meetingNumber: meetConfig.meetingNumber,
          userName: meetConfig.userName,
          signature: zoomsignature,
          apiKey: meetConfig.apiKey,
          passWord: meetConfig.passWord,

          success: (resp) => {
            console.log(resp);
          },

          error: (error) => {
            console.log(error);
          },
        });
      },
    });
  }

  const loadZoomScript = () => {
    let resolveLoadZoomScriptPromise = null;

    const loadZoomScriptPromise = new Promise((resolve) => {
      resolveLoadZoomScriptPromise = resolve;
    });
    addCss('https://source.zoom.us/1.9.0/css/bootstrap.css');
    addCss('https://source.zoom.us/1.9.0/css/react-select.css');

    [
      'https://source.zoom.us/1.9.0/lib/vendor/react.min.js',
      'https://source.zoom.us/1.9.0/lib/vendor/react-dom.min.js',
      'https://source.zoom.us/1.9.0/lib/vendor/redux.min.js',
      'https://source.zoom.us/1.9.0/lib/vendor/redux-thunk.min.js',
      'https://source.zoom.us/1.9.0/lib/vendor/lodash.min.js',
      'https://source.zoom.us/zoom-meeting-1.9.0.min.js',
    ].map((e, i) => {
      const script = document.createElement('script');
      script.src = e;
      script.async = true;
      if (i === 5) script.onload = resolveLoadZoomScriptPromise;
      document.body.appendChild(script);
    });

    // const scriptZoom = document.createElement('script');
    // scriptZoom.src = 'https://source.zoom.us/zoom-meeting-1.9.0.min.js';
    // scriptZoom.async = true;
    // scriptZoom.onload = resolveLoadZoomScriptPromise;
    // document.body.appendChild(scriptZoom);

    return loadZoomScriptPromise;
  };

  const initialiseZoom = useCallback(async () => {
    if (!window.ZoomMtg) {
      await loadZoomScript();
    }
  }, []);

  useEffect(() => {
    initialiseZoom().then((res) => {
      console.log('loaded');
      console.log(window.ZoomMtg);

      if (window.ZoomMtg) console.log('present');
      window.ZoomMtg.setZoomJSLib('https://dmogdx0jrul3u.cloudfront.net/1.9.0/lib', '/av');
      window.ZoomMtg.preLoadWasm();
      window.ZoomMtg.prepareJssdk();

      /**
       * You should not visible api secret key on frontend
       * Signature must be generated on server
       * https://marketplace.zoom.us/docs/sdk/native-sdks/web/essential/signature
       */
      window.ZoomMtg.generateSignature({
        meetingNumber: config.meetingNumber,
        apiKey: config.apiKey,
        apiSecret: apiKeys.apiSecret,
        role: config.role,
        success(resp) {
          console.log('res', resp);

          setTimeout(() => {
            joinMeeting(signature, config);
          }, 1000);
        },
      });
    });
  }, [initialiseZoom]);

  return <div>chalenge</div>;
};

export default ZoomMeeting;

ZoomMeeting.propTypes = {
  meetingNo: PropTypes.string.isRequired,
  meetingPass: PropTypes.string.isRequired,
  signature: PropTypes.string.isRequired,
};
