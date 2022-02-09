import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Alert from 'react-bootstrap/Alert';

export const AlertSlideup = (props) => {
  const { alertText, trigger } = props;
  const [style, setStyle] = useState({
    bottom: '10px',
    position: 'fixed',
    zIndex: 1000,
    transform: 'translateY(100px)',
    transitionDuration: '0.5s',
  });

  useEffect(() => {
    setStyle({
      bottom: '10px',
      position: 'fixed',
      zIndex: 1000,
      transform: trigger ? 'translateY(0px)' : 'translateY(100px)',
      transitionDuration: '0.5s',
    });
  }, [trigger]);

  return (
    <div style={style} className='text-center w-100 m-auto'>
      <Alert className='w-75 mx-auto text-center' variant='secondary'>
        {alertText}
      </Alert>
    </div>
  );
};

AlertSlideup.propTypes = {
  alertText: PropTypes.string.isRequired,
  trigger: PropTypes.bool.isRequired,
};
