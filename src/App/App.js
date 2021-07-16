import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import { ConnectedRouter } from 'connected-react-router';
import { connect } from 'react-redux';
// import io from 'socket.io-client';
// import loadable from '@loadable/component';
import { getCurrentcolor } from '../redux/reducers/color.reducer';
import { getCurrentBranding } from '../redux/reducers/branding.reducer';
import { conversationsActions } from '../redux/actions/conversations.action';
import { setGlobalColors, changeFaviconAndDocumentTitle } from '../Utilities';
import { Loader } from '../Components/Common/Loader/Loading';
import './App.scss';
import { history, Routes } from '../Routing';
import { getCurrentLoadingStatus, getStatusOfSpinner } from '../redux/reducers/loading.reducer';
import withClearCache from './BustCache';

// const io = loadable.lib(() => import('socket.io-client'));

function MainApp(props) {
  const { color, currentbranding, isLoading, setSocket, isSpinner } = props;

  useEffect(() => {
    // const SERVER = 'https://13.126.247.152:3000';
    const SERVER = 'https://portal.tca.ingeniumedu.com';
    import('socket.io-client').then((Module) => {
      // console.log(io);
      const socket = Module.io(SERVER, {
        transports: ['websocket', 'polling'],
      });
      socket.on('connect', () => {
        console.log(socket.id, 'connect');
      });

      socket.on('disconnect', () => {
        console.log(socket.id, 'disconnected');
      });

      setSocket({ socket });
      return () => socket.emit('disconnect');
    });
  }, []);

  useEffect(() => {
    console.log(isSpinner);
    if (Object.keys(color.color) !== 0) {
      const { primary, light, lighter, superLight } = color.color;
      setGlobalColors(primary, light, lighter, superLight);
    }

    if (Object.keys(currentbranding.branding) !== 0) {
      const { client_icon: clientIcon, client_title: clientTitle } = currentbranding.branding;
      changeFaviconAndDocumentTitle(clientIcon, clientTitle);
    }
  }, [color, currentbranding, isSpinner]);

  return (
    <Container fluid className='p-0 m-0 overflow-hidden rootContainer mx-auto'>
      {isLoading && <Loader isSpinner={isSpinner} />}
      <ConnectedRouter history={history}>
        <Routes />
      </ConnectedRouter>
    </Container>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    setSocket: (socket) => {
      dispatch(conversationsActions.setSocket(socket));
    },
  };
};

const mapStateToProps = (state) => ({
  color: getCurrentcolor(state),
  currentbranding: getCurrentBranding(state),
  isLoading: getCurrentLoadingStatus(state),
  isSpinner: getStatusOfSpinner(state),
});

const BustCache = withClearCache(connect(mapStateToProps, mapDispatchToProps)(MainApp));

function App() {
  return <BustCache />;
}

export default App;

MainApp.propTypes = {
  color: PropTypes.shape({
    color: PropTypes.shape({
      primary: PropTypes.string,
      light: PropTypes.string,
      lighter: PropTypes.string,
      superLight: PropTypes.string,
    }),
  }).isRequired,
  isLoading: PropTypes.bool.isRequired,
  currentbranding: PropTypes.shape({
    branding: PropTypes.instanceOf(Object).isRequired,
  }).isRequired,
  isSpinner: PropTypes.bool.isRequired,
  setSocket: PropTypes.func.isRequired,
};
