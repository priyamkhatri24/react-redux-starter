import React, { useState } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { connect } from 'react-redux';
import { getAmountLoaded, getTotalLoaded } from '../../../redux/reducers/loading.reducer';
import './Loading.scss';

const mapStateToProps = (state) => ({
  totalLoaded: getTotalLoaded(state),
  amountLoaded: getAmountLoaded(state),
});

export const Loader = connect(mapStateToProps)((props) => {
  const { totalLoaded, amountLoaded } = props;

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
        <ProgressBar animated now={amountLoaded} label={`${amountLoaded}%`} max={totalLoaded} />
      </div>
    </div>
  );
});
