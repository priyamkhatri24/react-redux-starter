import React from 'react';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { withRouter } from 'react-router-dom';

export const BackButton = withRouter((props) => {
  const style = {
    color: props.color,
  };

  return <ArrowBackIcon onClick={props.history.goBack} style={style} />;
});
