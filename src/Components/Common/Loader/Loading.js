import React, { useState } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { useInterval } from '../../../Utilities';
import './Loading.scss';

export const Loader = () => {
  const [count, setCount] = useState(0);
  useInterval(() => {
    if (count >= 100) {
      return;
    }
    setCount(count + 1);
  }, 20);

  return (
    <div
      className='d-flex  justify-content-center align-items-center'
      style={{
        height: '100%',
        width: '100%',
        position: 'fixed',
        top: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(255,255,255,0.8)',
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <div className='Preloader mx-auto' style={{ width: '40%' }}>
        <h6 className='m-lg-3 m-5 text-center'>Uploading...</h6>
        <ProgressBar animated now={count} label={`${count}%`} max={100} />
      </div>
    </div>
  );
};
