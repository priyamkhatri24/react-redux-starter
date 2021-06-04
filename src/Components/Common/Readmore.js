import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';

export const Readmore = ({ maxcharactercount, batchesArray }) => {
  const text = batchesArray.reduce((acc, curr) => `${acc}  ${curr} ,`, '').slice(0, -1);
  const [isHidden, setIsHidden] = useState(true);
  const resultText = isHidden ? text.slice(0, maxcharactercount) : text;
  const buttonStyle = {
    paddingTop: '2px',
    paddingBottom: '2px',
    paddingLeft: '0px',
    fontSize: '12px',
    display: 'inline-block',
    marginLeft: '5px',
  };
  const toggleview = (e) => {
    e.stopPropagation();
    setIsHidden(!isHidden);
  };

  return (
    <>
      {text.length > 100 ? (
        <span style={{ wordWrap: 'break-word' }}>
          {`${resultText} ${isHidden ? '. . .' : ' '} `}
          <Button onClick={(e) => toggleview(e)} variant='boldText' style={buttonStyle}>
            {isHidden ? 'Read more' : 'Read less'}
          </Button>
        </span>
      ) : (
        <span>{resultText}</span>
      )}
    </>
  );
};

export default Readmore;

Readmore.propTypes = {
  // childern:PropTypes.string.isRequired,
  maxcharactercount: PropTypes.number.isRequired,
  batchesArray: PropTypes.instanceOf(Array).isRequired,
};
