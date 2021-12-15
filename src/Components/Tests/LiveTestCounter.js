import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import fromUnixTime from 'date-fns/fromUnixTime';
import compareAsc from 'date-fns/compareAsc';
import differenceInSeconds from 'date-fns/differenceInSeconds';
import { get, apiValidation } from '../../Utilities';

const LiveTestCounter = (props) => {
  const [hours, setHours] = useState(60);
  const [minutes, setMinutes] = useState(60);
  const [seconds, setSeconds] = useState(60);
  const [displayText, setDisplayText] = useState('');
  const [liveText, setLiveText] = useState('');
  const { id, isAllowed } = props;

  useEffect(() => {
    get({ test_id: id }, '/getTestAvailability').then((res) => {
      const result = apiValidation(res);
      const currentTime = fromUnixTime(result.current_time);
      const testStartTime = fromUnixTime(parseInt(result.test_start_time, 10));
      const dateResult = compareAsc(currentTime, testStartTime);
      if (dateResult > 0 && Number(result.status) !== 1) {
        setDisplayText('The Test has expired');
      } else if (dateResult < 0) {
        const durationTime = differenceInSeconds(testStartTime, currentTime);
        setHours(Math.floor(durationTime / 3600));
        setMinutes(Math.floor((durationTime % 3600) / 60));
        setSeconds(Math.floor(durationTime % 60));
      } else if (Number(result.status) === 1 && dateResult > 0) {
        setLiveText('The Test is Live');
        console.log('livee');
        isAllowed(
          true,
          id,
          parseInt(result.test_start_time, 10),
          parseInt(result.test_end_time, 10),
        );
      }
    });
  }, [id]);

  useEffect(() => {
    const clear = setInterval(() => {
      if (seconds > 0) {
        setSeconds((second) => second - 1);
      }

      if (seconds === 0) {
        if (minutes === 0) {
          if (hours === 0) {
            setLiveText('The Test is Live');
            isAllowed(true, id);
            console.log('livee');
            clearInterval(clear);
          } else {
            setMinutes(59);
            setHours((hour) => hour - 1);
          }
        } else {
          setMinutes((minute) => minute - 1);
          setSeconds(59);
        }
      }
    }, 1000);

    return () => clearInterval(clear); // This is important
  }, [hours, seconds, minutes, isAllowed, id]);

  // useInterval(() => {
  //   if (seconds > 0) {
  //     setSeconds(seconds - 1);
  //   }

  //   if (seconds === 0) {
  //     if (minutes === 0) {
  //       if (hours === 0) {
  //         setLiveText('The Test is Live');
  //         isAllowed(true, id);
  //       } else {
  //         setMinutes(59);
  //         setHours(hours - 1);
  //       }
  //     } else {
  //       setMinutes(minutes - 1);
  //       setSeconds(59);
  //     }
  //   }
  // }, 1000);

  return (
    <div>
      {displayText && <p className='Tests__Counter pl-3 mt-1'>{displayText}</p>}
      {!displayText && !liveText && (
        <p className='Tests__scrollableCardText pl-3 mt-1'>
          Starts In:{' '}
          <span className='Tests__Counter '>
            {hours === 0 ? '00:' : hours < 10 ? `0${hours}:` : `${hours}:`}
            {minutes === 0 ? '00:' : minutes < 10 ? `0${minutes}:` : `${minutes}:`}
            {seconds < 0 ? '' : seconds < 10 ? `0${seconds}` : `${seconds}`}
          </span>
        </p>
      )}
      {liveText && <p className='Tests__Counter pl-3 mt-1'>{liveText}</p>}
    </div>
  );
};

export default LiveTestCounter;

LiveTestCounter.propTypes = {
  isAllowed: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
};
