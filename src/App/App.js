import React from 'react';
import Container from 'react-bootstrap/Container';
import { ConnectedRouter } from 'connected-react-router';
import { connect } from 'react-redux';
import './App.scss';
import { history, Routes } from '../Routing';
import withClearCache from './BustCache';

// const io = loadable.lib(() => import('socket.io-client'));

function MainApp(props) {
  return (
    <Container fluid className='p-0 m-0 rootContainer mx-auto'>
      <ConnectedRouter history={history}>
        <Routes />
      </ConnectedRouter>
    </Container>
  );
}

const BustCache = withClearCache(connect(null, null)(MainApp));

function App() {
  return <BustCache />;
}

export default App;

MainApp.propTypes = {};
