import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';

function Readmore({ maxcharactercount, batchesArray }) {
  const text = batchesArray.reduce((acc, curr) => `${acc}  ${curr} ,`, '');
  const [isHidden, setIsHidden] = useState(true);
  const resultText = isHidden ? text.slice(0, maxcharactercount) : text;
  const buttonStyle = {
    paddingTop: '2px',
    paddingBottom: '2px',
    paddingLeft: '0px',
    fontSize: '12px',
    display: 'inline-block',
  };
  const toggleview = () => {
    setIsHidden(!isHidden);
  };

  return (
    <p>
      {text.length > 100 ? (
        <p>
          {`${resultText}. . .`}
          <Button onClick={toggleview} variant='boldText' style={buttonStyle}>
            {isHidden ? 'Read more' : 'Read less'}
          </Button>
        </p>
      ) : (
        <p>{resultText}</p>
      )}
    </p>
  );
}

export default Readmore;

Readmore.propTypes = {
  // childern:PropTypes.string.isRequired,
  maxcharactercount: PropTypes.number.isRequired,
  batchesArray: PropTypes.instanceOf(Array).isRequired,
};
