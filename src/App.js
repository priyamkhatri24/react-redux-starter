import React from 'react';
import Container from 'react-bootstrap/Container';
import './App.scss';
import Login from './Components/Login/Login';

function App() {
  return (
    <Container fluid className='p-0 m-0 overflow-hidden'>
      <Login />
    </Container>
  );
}

export default App;
