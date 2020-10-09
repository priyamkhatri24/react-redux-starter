import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

const Jitsi = (props) => {
  const jitsiContainerId = 'jitsi-container-id';

  const { domain, jitsiDisplayHide, firstName, lastName, roomName, role } = props;
  const [jitsi, setJitsi] = useState({});

  const toolBarOptions = [
    'microphone',
    'camera',
    'closedcaptions',
    'desktop',
    'fullscreen',
    'fodeviceselection',
    'hangup',
    'profile',
    'chat',
    'recording',
    'etherpad',
    'settings',
    'raisehand',
    'videoquality',
    'filmstrip',
    'feedback',
    'shortcuts',
    'tileview',
    'videobackgroundblur',
    'download',
    'help',
  ];

  const loadJitsiScript = () => {
    let resolveLoadJitsiScriptPromise = null;

    const loadJitsiScriptPromise = new Promise((resolve) => {
      resolveLoadJitsiScriptPromise = resolve;
    });

    const script = document.createElement('script');
    script.src = 'https://tcalive.ingeniumedu.com/external_api.js';
    script.async = true;
    script.onload = resolveLoadJitsiScriptPromise;
    document.body.appendChild(script);

    return loadJitsiScriptPromise;
  };

  // const initialiseJitsi = async () => {
  //   if (!window.JitsiMeetExternalAPI) {
  //     await loadJitsiScript();
  //   }

  //   const options = {
  //     roomName: 'JitsiMeetAPIExamplefjhdfjhlkadfjhkjdkvkjabdlkadfjslkkbsdlkfdbvlkasjbf',
  //     parentNode: document.getElementById(jitsiContainerId),
  //   };

  //   const jitsiWindow = new window.JitsiMeetExternalAPI(domain, options);

  //   setJitsi(jitsiWindow);
  // };

  const initialiseJitsi = useCallback(async () => {
    if (!window.JitsiMeetExternalAPI) {
      await loadJitsiScript();
    }

    const studentOptions = {
      roomName,
      parentNode: document.getElementById(jitsiContainerId),
      interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: toolBarOptions,
        SHOW_JITSI_WATERMARK: false,
        JITSI_WATERMARK_LINK: '',
      },
      configOverwrite: { startWithAudioMuted: true, startWithVideoMuted: true },
      userInfo: {
        displayName: `${firstName} ${lastName}`,
      },
    };

    const teacherOptions = {
      roomName,
      parentNode: document.getElementById(jitsiContainerId),
      interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: toolBarOptions,
        SHOW_JITSI_WATERMARK: false,
        JITSI_WATERMARK_LINK: '',
      },
      userInfo: {
        displayName: `${firstName} ${lastName}`,
      },
    };
    let jitsiWindow;
    if (role === 'teacher') {
      jitsiWindow = new window.JitsiMeetExternalAPI(domain, teacherOptions);
    } else if (role === 'student') {
      jitsiWindow = new window.JitsiMeetExternalAPI(domain, studentOptions);
    }
    jitsiWindow.addEventListener('videoConferenceJoined', (elem) => {
      console.log('Local User Joined', elem.roomName);
    });

    jitsiWindow.on('readyToClose', () => {
      jitsiDisplayHide();
    });

    setJitsi(jitsiWindow);
  }, [domain, jitsiDisplayHide, roomName, toolBarOptions, firstName, lastName, role]);

  useEffect(() => {
    initialiseJitsi();
    if (role === 'teacher') toolBarOptions.push('mute-everyone');

    return () => jitsi?.dispose?.();
  }, []);

  return <div id={jitsiContainerId} style={{ height: '90%', width: '100%' }} />;
};

export default Jitsi;

Jitsi.propTypes = {
  domain: PropTypes.string.isRequired,
  jitsiDisplayHide: PropTypes.func.isRequired,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  roomName: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
};

Jitsi.defaultProps = {
  firstName: '',
  lastName: '',
};
