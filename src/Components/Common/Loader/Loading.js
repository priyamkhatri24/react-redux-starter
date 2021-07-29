import React, { useEffect, useState } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Spinner from 'react-bootstrap/Spinner';
import { connect } from 'react-redux';
import {
  getAmountLoaded,
  getStatusOfSpinner,
  getTotalLoaded,
} from '../../../redux/reducers/loading.reducer';
import './Loading.scss';

const mapStateToProps = (state) => ({
  totalLoaded: getTotalLoaded(state),
  amountLoaded: getAmountLoaded(state),
  isSpinner: getStatusOfSpinner(state),
});

export const Loader = connect(mapStateToProps)((props) => {
  const { totalLoaded, amountLoaded, isSpinner } = props;
  const [spinner, setSpinner] = useState(false);

  useEffect(() => {
    setSpinner(isSpinner);
    console.log(spinner, 'sdada');
  }, [isSpinner, spinner]);

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
      {spinner ? (
        <Spinner animation='border' role='status'>
          <span className='sr-only'>Loading...</span>
        </Spinner>
      ) : (
        <div className='Preloader mx-auto' style={{ width: '40%' }}>
          <h6 className='m-lg-3 m-5 text-center'>Uploading...</h6>
          <ProgressBar animated now={amountLoaded} label={`${amountLoaded}%`} max={totalLoaded} />
        </div>
      )}
    </div>
  );
});
