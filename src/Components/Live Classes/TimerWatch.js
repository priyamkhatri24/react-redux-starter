import React from 'react';
import PropTypes from 'prop-types';
/* eslint-disable */
const TimerWatch = (props) => {
  const { time, started, isLive } = props;
  return (
    <div>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='62.723'
        height='110.393'
        viewBox='0 0 62.723 110.393'
      >
        <g id='smartWatch' transform='translate(-12 -2)'>
          <path
            id='Path_2905'
            data-name='Path 2905'
            d='M39.018,27.545H34V15h5.018a2.51,2.51,0,0,1,2.509,2.509v7.527A2.51,2.51,0,0,1,39.018,27.545Z'
            transform='translate(33.196 19.616)'
            fill='#546e7a'
          />
          <path
            id='Path_2906'
            data-name='Path 2906'
            d='M53.132,16.05,51.74,6.308A5.016,5.016,0,0,0,46.772,2h-21.4A5.019,5.019,0,0,0,20.4,6.308l-1.39,9.742A10.646,10.646,0,0,1,16,22.071h0V29.6H56.143V22.071h0A10.646,10.646,0,0,1,53.132,16.05ZM19.011,98.343l1.392,9.742a5.016,5.016,0,0,0,4.968,4.308h21.4a5.019,5.019,0,0,0,4.968-4.308l1.39-9.742a10.646,10.646,0,0,1,3.011-6.021h0V84.794H16v7.527h0A10.646,10.646,0,0,1,19.011,98.343Z'
            transform='translate(6.036)'
            fill='#9f0217'
          />
          <path
            id='Path_2907'
            data-name='Path 2907'
            d='M62.178,80.25H22.036A10.036,10.036,0,0,1,12,70.214V20.036A10.036,10.036,0,0,1,22.036,10H62.178A10.036,10.036,0,0,1,72.214,20.036V70.214A10.036,10.036,0,0,1,62.178,80.25Z'
            transform='translate(0 12.071)'
            fill='#607d8b'
          />
          <path
            id='Path_2908'
            data-name='Path 2908'
            d='M59.161,72.214H19.018A5.016,5.016,0,0,1,14,67.2V17.018A5.016,5.016,0,0,1,19.018,12H59.161a5.016,5.016,0,0,1,5.018,5.018V67.2A5.016,5.016,0,0,1,59.161,72.214Z'
            transform='translate(3.018 15.089)'
            fill='#001c2a'
          />
          <text
            id='_23:59_hrs_left'
            data-name='23:59 hrs left'
            transform='translate(17 40)'
            fill='#f44336'
            font-size={!isLive && started ? '8px' : '15px'}
            font-family='Montserrat-ExtraBold, Montserrat'
            font-weight='800'
          >
            <tspan x='4' y='15'>
              {!isLive && !started && time}
            </tspan>
            <tspan x={isLive ? '4' : '3'} y={isLive ? '20' : '10'}>
              {!isLive && started && 'waiting to'}
              {isLive && 'LIVE!'}
            </tspan>
            <tspan y='15' font-family='Montserrat-Medium, Montserrat' font-weight='500'>
              {' '}
            </tspan>
            <tspan x='11' y='25'>
              {!isLive && started && 'start...'}
            </tspan>
            <tspan y='15' font-family='Montserrat-Medium, Montserrat' font-weight='500'>
              {' '}
            </tspan>
            <tspan
              x='4'
              y='35'
              font-size='12'
              font-family='Montserrat-Regular, Montserrat'
              font-weight='400'
            >
              {!isLive && !started && 'hrs left'}
            </tspan>
          </text>
        </g>
      </svg>
    </div>
  );
};

TimerWatch.propTypes = {
  time: PropTypes.string.isRequired,
  started: PropTypes.bool.isRequired,
  isLive: PropTypes.bool.isRequired,
};

export default TimerWatch;
