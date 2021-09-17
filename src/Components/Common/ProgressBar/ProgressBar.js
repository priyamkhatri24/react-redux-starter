import React from 'react';
import PropTypes from 'prop-types';
import classes from './ProgressBar.module.css';

const ProgressBar = (props) => {
  const { width, height, customStyle, borderRadius, myProgressCustomStyle } = props;
  return (
    <>
      <div style={{ borderRadius, ...myProgressCustomStyle }} className={classes.myProgress}>
        <div style={{ width, height, ...customStyle }} className={classes.myBar} />
      </div>
    </>
  );
};

export default ProgressBar;

ProgressBar.propTypes = {
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  customStyle: PropTypes.instanceOf(Object),
  myProgressCustomStyle: PropTypes.instanceOf(Object),
  borderRadius: PropTypes.string,
};

ProgressBar.defaultProps = {
  customStyle: {},
  borderRadius: '100px',
  myProgressCustomStyle: {},
};
