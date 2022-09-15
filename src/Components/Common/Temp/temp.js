import React, { useEffect } from 'react';
import ReactPlayer from 'react-player';

const Temp = () => {
  const html = `<span style='z-index: 100;width: 15px;height: 15px;
  background-color: transparent;position: absolute;right: 0px;margin-top: 3px;'>
  <svg xmlns="http://www.w3.org/2000/svg" width="14.479" height="13.584" viewBox="0 0 14.479 13.584">
  <path id="more_FILL1_wght700_GRAD200_opsz20" d="M7.875,11.125a1.1,1.1,0,0,0,.792-.323,1.132,1.132,0,0,0,0-1.6,
  1.171,1.171,0,0,0-1.615,0,1.107,1.107,0,0,0,0,1.6,1.16,1.16,0,0,0,.823.323Zm3.021.021a1.123,1.123,0,0,0,
  .812-.323,1.13,1.13,0,0,0,0-1.6A1.123,1.123,0,0,0,10.9,8.9a1.125,1.125,0,1,0,0,2.25Zm3.042,0a1.123,1.123,
  0,0,0,.812-.323,1.132,1.132,0,0,0,0-1.6,1.123,1.123,0,0,0-.812-.323,1.125,1.125,0,1,0,0,2.25ZM7.583,16.792A2.612,
  2.612,0,0,1,6.4,16.51a2.517,2.517,0,0,1-.917-.76L2.6,11.688a2.873,2.873,0,0,1-.521-1.678,2.968,2.968,0,0,1
  ,.521-1.7L5.5,4.229a2.156,2.156,0,0,1,.906-.771,2.82,2.82,0,0,1,1.177-.25h8.063c.819,0,.916,0,.916,0s0
  ,2.108,0,2.913v7.75c0,.805,0,2.917,0,2.917H7.583Z" transform="translate(-2.083 -3.208)" fill="#c6db6e"/>
</svg></span>`;

  useEffect(() => {
    document.querySelector('.lol').insertAdjacentHTML('beforeend', html);
  }, []);
  return (
    <div className='lol'>
      <h1>TEMP</h1>
    </div>
  );
};

export default Temp;
