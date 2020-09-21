import React from 'react';
import Container from 'react-bootstrap/Container';
import './App.scss';
import { ConnectedRouter } from 'connected-react-router';

import { history, Routes } from '../Routing';

function App() {
  return (
    <Container fluid className='p-0 m-0 overflow-hidden'>
      <ConnectedRouter history={history}>
        <Routes />
      </ConnectedRouter>
    </Container>
  );
}

export default App;
