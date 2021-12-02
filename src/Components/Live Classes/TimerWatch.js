import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useInterval } from '../../Utilities';
/* eslint-disable */
const TimerWatch = (props) => {
  const { time, isLive, startedProp, showStartNow } = props;
  const [currentTime, setCurrentTime] = useState(time);
  const [hours, setHours] = useState(time.split(':')[0]);
  const [minutes, setMinutes] = useState(time.split(':')[1]);
  const [seconds, setSeconds] = useState(time.split(':')[2]);
  const [inSeconds, setInSeconds] = useState(false);
  const [isWaitingToStart, setIsWaitingToStart] = useState(false);
  // const [isLiveState, setIsLiveState] = useState(false);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    console.log(time, hours, minutes, 'haha');
    if (hours === '00' && parseInt(minutes) < 15) {
      console.log(currentTime, 'nklaaa');
      console.log(currentTime.split(':'));
      setCurrentTime((time) => time.slice(3, 8));
      setInSeconds(true);
    } else {
      setCurrentTime((time) => time.slice(0, 5));
      setInSeconds(false);
    }
    if (startedProp) {
      setStarted(true);
      console.log('startedProp');
    }
  }, []);
  useEffect(() => {
    const clear = setInterval(() => {
      if (seconds > 0) {
        setSeconds((second) => second - 1);
      }

      if (seconds === 0) {
        if (minutes === 0) {
          if (hours === 0) {
            // setIsWaitingToStart(true)
            clearInterval(clear);
          } else {
            setMinutes(59);
            setSeconds(59);
            setHours((hour) => hour - 1);
          }
        } else {
          setMinutes((minute) => minute - 1);
          setSeconds(59);
        }
      }

      if (hours === '00' && parseInt(minutes) < 15) {
        // console.log(currentTime.split(':'));
        const min = minutes.toLocaleString('en-US', {
          minimumIntegerDigits: 2,
          useGrouping: false,
        });
        // if (min < 10) {
        //   min = `0${min}`;
        // }
        const sec = seconds.toLocaleString('en-US', {
          minimumIntegerDigits: 2,
          useGrouping: false,
        });
        // if (sec < 10) {
        //   sec = `0${sec}`;
        // }
        setCurrentTime(`${min}:${sec}`);
        setInSeconds(true);
        // showStartNow();
      } else {
        const hr = hours.toLocaleString('en-US', {
          minimumIntegerDigits: 2,
          useGrouping: false,
        });

        const min = minutes.toLocaleString('en-US', {
          minimumIntegerDigits: 2,
          useGrouping: false,
        });
        // if (min < 10) {
        //   min = `0${min}`;
        // }
        setCurrentTime(`${hr}:${min}`);
        setInSeconds(false);
      }

      // if (parseInt(hours) < 0) {
      //   setIsWaitingToStart(true);
      // }
      if (hours === '00' && parseInt(minutes) === 14 && parseInt(seconds) === 59) {
        showStartNow();
      }
      if (parseInt(hours) <= 0 && parseInt(minutes) <= 0 && parseInt(seconds) <= 0) {
        setStarted(true);
      }
    }, 1000);

    return () => clearInterval(clear); // This is important
  }, [hours, seconds, minutes, started, isLive]);

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
              {!isLive && !started && currentTime}
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
            {!inSeconds && (
              <tspan
                x='4'
                y='35'
                font-size='12'
                font-family='Montserrat-Regular, Montserrat'
                font-weight='400'
              >
                {!isLive && !started && 'hrs left'}
              </tspan>
            )}
            {inSeconds && (
              <tspan
                x='4'
                y='35'
                font-size='10'
                font-family='Montserrat-Regular, Montserrat'
                font-weight='400'
              >
                {!isLive && !started && 'mins left'}
              </tspan>
            )}
          </text>
        </g>
      </svg>
    </div>
  );
};

TimerWatch.propTypes = {
  time: PropTypes.string.isRequired,
  startedProp: PropTypes.bool.isRequired,
  isLive: PropTypes.bool.isRequired,
  showStartNow: PropTypes.func,
};

TimerWatch.defaultProps = {
  showStartNow: () => {},
};

export default TimerWatch;
