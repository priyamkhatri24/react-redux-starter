import React, { useState } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import TextLoop from 'react-text-loop';
import { useInterval } from '../../../Utilities';
import './Preloader.scss';

const Preloader = () => {
  const [count, setCount] = useState(0);
  useInterval(() => {
    if (count >= 100) {
      return;
    }
    setCount(count + 1);
  }, 50);

  const hello = ['Hello', 'Dumantis', 'Bonjour', 'Namaskar'];

  return (
    <div className='Preloader mx-auto '>
      <h5 className='Preloader__hello m-lg-3 m-5 p-lg-5'>HELLO!</h5>
      <h6 className='m-lg-3 m-5 text-center'>
        <TextLoop mask='true' interval={1000}>
          {hello}
        </TextLoop>
      </h6>

      <ProgressBar now={count} label={`${count}%`} max={100} />
    </div>
  );
};

export default Preloader;
