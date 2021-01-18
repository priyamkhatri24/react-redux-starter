import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { PageHeader } from '../PageHeader/PageHeader';

export const TempViewFile = (props) => {
  const {
    history: {
      location: {
        state: { filePath },
      },
    },
  } = props;

  useEffect(() => {
    console.log(props.history.location.state.filePath);
  });

  return (
    <div>
      <PageHeader title='File Viewer' />
      <div
        style={{
          marginTop: '5rem',
          width: '100%',
          height: '100vh',
          paddingBottom: '56%',
          position: 'relative',
        }}
      >
        <iframe
          title='file viewer'
          src={`https://view.officeapps.live.com/op/embed.aspx?src=${filePath}?zoomTo='pageWidth'`}
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            display: 'block',
            top: 0,
            left: 0,
          }}
        />
      </div>
    </div>
  );
};

TempViewFile.propTypes = {
  history: PropTypes.shape({
    location: PropTypes.shape({
      state: PropTypes.shape({
        filePath: PropTypes.string.isRequired,
      }),
    }),
  }).isRequired,
};
