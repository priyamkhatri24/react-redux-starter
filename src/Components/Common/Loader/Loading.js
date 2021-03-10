import React from 'react';

export const Loader = () => {
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
      <div
        className='spinner-border text-primary'
        role='status'
        style={{ display: 'flex', margin: '0 auto' }}
      >
        <span className='sr-only'>Loading...</span>
      </div>
    </div>
  );
};
