import React from 'react';
import './DiwaliLights.scss';

const DiwaliLights = () => {
  const liArray = new Array(100).fill(0);
  return (
    <ul className='lightrope'>
      {liArray.map((ele) => {
        return <li>.</li>;
      })}
    </ul>
  );
};

export default DiwaliLights;
