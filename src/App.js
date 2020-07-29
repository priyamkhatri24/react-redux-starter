import React from 'react';
import Container from 'react-bootstrap/Container';
import './App.scss';
import { Router } from 'react-router-dom';
import { history, Routes } from './Routing';

function App() {
  return (
    <Container fluid className='p-0 m-0 overflow-hidden'>
      <Router history={history}>
        <Routes />
      </Router>
    </Container>
  );
}

export default App;
