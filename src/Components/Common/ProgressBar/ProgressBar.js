import React from 'react';
import PropTypes from 'prop-types';
import classes from './ProgressBar.module.css';

const ProgressBar = (props) => {
  const { width } = props;
  return (
    <>
      <div className={classes.myProgress}>
        <div style={{ width }} className={classes.myBar} />
      </div>
    </>
  );
};

export default ProgressBar;

ProgressBar.propTypes = {
  width: PropTypes.string.isRequired,
};
