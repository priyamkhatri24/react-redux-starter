import React from 'react';
import './ChatDots.scss';
import FiberManualRecordSharpIcon from '@material-ui/icons/FiberManualRecordSharp';

export const ChatDots = () => {
  return (
    <p className='Chatdots ml-3'>
      <span>
        <FiberManualRecordSharpIcon />
      </span>
      <span>
        <FiberManualRecordSharpIcon />
      </span>
      <span>
        <FiberManualRecordSharpIcon />
      </span>
    </p>
  );
};
