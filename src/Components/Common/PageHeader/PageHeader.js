import React from 'react';
import PropTypes from 'prop-types';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { BackButton } from '../BackButton/BackButton';

export const PageHeader = (props) => {
  const { title } = props;
  return (
    <div className='PageHeader p-3 d-flex'>
      <BackButton />
      <span
        className='ml-3'
        style={{
          fontSize: '20px',
          fontFamily: 'Montserrat-Medium',
          lineHeight: '24px',
          color: 'rgba(0, 0, 0, 0.87)',
        }}
      >
        {title}
      </span>

      <div className='ml-auto'>
        <MoreVertIcon />
      </div>
    </div>
  );
};

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
};
